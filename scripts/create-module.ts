import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { modulesDir, repoRoot } from '../tooling/config/project-paths'
import { syncComponentRegistry } from '../tooling/scripts/component-registry'

type ModuleMeta = {
  componentName: string
  pascalName: string
  kebabName: string
}

type OutputFile = {
  path: string
  content: string
}

function printUsage(): void {
  console.log(`Usage:
  pnpm module <name> [--dry-run]

Examples:
  pnpm module form
  pnpm module data-table
  pnpm module BzForm --dry-run`)
}

function parseArgs(argv: string[]): { dryRun: boolean; rawName: string } {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(argv.length === 0 ? 1 : 0)
  }

  const dryRun = argv.includes('--dry-run')
  const nameArg = argv.find((arg) => !arg.startsWith('-'))

  if (!nameArg) {
    throw new Error('Missing module name.')
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

function resolveModuleMeta(rawName: string): ModuleMeta {
  const words = splitWords(rawName)

  if (words.length === 0) {
    throw new Error(`Invalid module name "${rawName}".`)
  }

  const pascalName = words.map(capitalize).join('')
  const kebabName = words.join('-')
  const componentName = `Bz${pascalName}`

  return {
    componentName,
    pascalName,
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

function buildIndexTemplate(meta: ModuleMeta): string {
  return `import { withInstall } from '@bzsh-ui/internal'

const ${meta.pascalName} = {
  name: '${meta.componentName}',
}

export const ${meta.componentName} = withInstall(${meta.pascalName}, '${meta.componentName}')

export default ${meta.componentName}
`
}

function buildReadmeTemplate(meta: ModuleMeta): string {
  return `# ${meta.pascalName}

组合模块说明文档占位文件。
`
}

async function main(): Promise<void> {
  const { rawName, dryRun } = parseArgs(process.argv.slice(2))
  const meta = resolveModuleMeta(rawName)
  const moduleRoot = path.join(modulesDir, meta.kebabName)

  if (await pathExists(moduleRoot)) {
    throw new Error(`Module already exists: packages/modules/${meta.kebabName}`)
  }

  const outputs: OutputFile[] = [
    {
      path: path.join(moduleRoot, 'index.ts'),
      content: buildIndexTemplate(meta),
    },
    {
      path: path.join(moduleRoot, 'README.md'),
      content: buildReadmeTemplate(meta),
    },
  ]

  if (dryRun) {
    console.log('# Dry Run')
    console.log(`Module: ${meta.componentName}`)
    console.log(`Directory: packages/modules/${meta.kebabName}`)
    console.log('')
    outputs.forEach((output) => {
      console.log(`Create: ${path.relative(repoRoot, output.path)}`)
    })
    await syncComponentRegistry({ dryRun: true })
    return
  }

  await mkdir(moduleRoot, { recursive: true })
  await Promise.all(outputs.map((output) => writeFile(output.path, output.content, 'utf8')))
  await syncComponentRegistry()

  console.log(`Created module scaffold: ${meta.componentName}`)
  console.log(`- packages/modules/${meta.kebabName}/index.ts`)
  console.log(`- packages/modules/${meta.kebabName}/README.md`)
  console.log('Updated: packages/modules/index.ts')
  console.log('Updated: packages/ui/defaults.ts')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
