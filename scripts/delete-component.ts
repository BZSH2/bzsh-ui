import { rm, stat } from 'node:fs/promises'
import path from 'node:path'

import {
  componentsDir,
  docsDir,
  repoRoot,
} from '../tooling/config/project-paths'
import { syncComponentRegistry } from '../tooling/scripts/component-registry'

type DeleteComponentMeta = {
  componentName: string
  kebabName: string
}

function printUsage(): void {
  console.log(`Usage:
  pnpm deleteC <name> [--dry-run]

Examples:
  pnpm deleteC button
  pnpm deleteC Button
  pnpm deleteC BzButton
  pnpm deleteC date-picker --dry-run`)
}

function parseArgs(argv: string[]): { dryRun: boolean; rawName: string } {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(argv.length === 0 ? 1 : 0)
  }

  const dryRun = argv.includes('--dry-run')
  const nameArg = argv.find((arg) => !arg.startsWith('-'))

  if (!nameArg) {
    throw new Error('Missing component name.')
  }

  return {
    dryRun,
    rawName: nameArg.trim(),
  }
}

function splitWords(input: string): string[] {
  return input
    .replace(/^Bz(?=[A-Z])/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .split('-')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function resolveComponentMeta(rawName: string): DeleteComponentMeta {
  const words = splitWords(rawName)

  if (words.length === 0) {
    throw new Error(`Invalid component name "${rawName}".`)
  }

  const pascalName = words.map(capitalize).join('')
  const componentName = `Bz${pascalName}`
  const kebabName = words.join('-')

  return {
    componentName,
    kebabName,
  }
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

async function main(): Promise<void> {
  const { rawName, dryRun } = parseArgs(process.argv.slice(2))
  const meta = resolveComponentMeta(rawName)
  const componentRoot = path.join(componentsDir, meta.kebabName)
  const docsFilePath = path.join(
    docsDir,
    'components',
    `${meta.kebabName}.md`
  )
  const testFilePath = path.join(repoRoot, 'tests', `${meta.kebabName}.spec.ts`)

  if (!(await pathExists(componentRoot))) {
    throw new Error(
      `Component not found: packages/components/${meta.kebabName}`
    )
  }

  // Docs and tests are optional companions, so only remove them when present.
  const deleteTargets: string[] = [componentRoot]

  if (await pathExists(docsFilePath)) {
    deleteTargets.push(docsFilePath)
  }

  if (await pathExists(testFilePath)) {
    deleteTargets.push(testFilePath)
  }

  if (dryRun) {
    console.log('# Dry Run')
    console.log(`Component: ${meta.componentName}`)
    deleteTargets.forEach((target) => {
      console.log(`Delete: ${path.relative(repoRoot, target)}`)
    })
    await syncComponentRegistry({ dryRun: true })
    return
  }

  await Promise.all(
    deleteTargets.map((target) => rm(target, { recursive: true, force: true }))
  )

  // Keep generated entry files in sync after removing the source directory.
  await syncComponentRegistry()

  console.log(`Deleted component: ${meta.componentName}`)
  deleteTargets.forEach((target) => {
    console.log(`- ${path.relative(repoRoot, target)}`)
  })
  console.log('Updated: packages/components/index.ts')
  console.log('Updated: packages/ui/defaults.ts')
  console.log('Updated: packages/theme-chalk/src/index.scss')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
