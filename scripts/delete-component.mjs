import { readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const componentsIndexPath = path.join(repoRoot, 'packages/components/index.ts')
const metadataPath = path.join(repoRoot, 'packages/components/metadata.ts')
const themeIndexPath = path.join(
  repoRoot,
  'packages/theme-chalk/src/index.scss'
)

function printUsage() {
  console.log(`Usage:
  pnpm deleteC <name> [--dry-run]

Examples:
  pnpm deleteC button
  pnpm deleteC Button
  pnpm deleteC BzButton
  pnpm deleteC date-picker --dry-run`)
}

function parseArgs(argv) {
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
    rawName: nameArg.trim()
  }
}

function splitWords(input) {
  return input
    .replace(/^Bz(?=[A-Z])/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .split('-')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function resolveComponentMeta(rawName) {
  const words = splitWords(rawName)

  if (words.length === 0) {
    throw new Error(`Invalid component name "${rawName}".`)
  }

  const pascalName = words.map(capitalize).join('')
  const componentName = `Bz${pascalName}`
  const kebabName = words.join('-')

  return {
    componentName,
    kebabName
  }
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

function removeLine(source, line) {
  return source
    .split('\n')
    .filter((item) => item.trim() !== line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
}

function removeStyleUseLine(source, kebabName) {
  return source
    .split('\n')
    .filter(
      (line) => !line.includes(`../../components/${kebabName}/style/index'`)
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
}

function removeMetadataEntry(source, kebabName) {
  const blockPattern = new RegExp(
    `\\s*\\{\\n\\s*exportName: 'Bz[^']+',\\n\\s*kebabName: '${kebabName}'\\n\\s*\\},?\\n?`,
    'g'
  )

  return source.replace(blockPattern, '\n').replace(/\n{3,}/g, '\n\n')
}

async function main() {
  const { rawName, dryRun } = parseArgs(process.argv.slice(2))
  const meta = resolveComponentMeta(rawName)
  const componentRoot = path.join(
    repoRoot,
    'packages/components',
    meta.kebabName
  )
  const docsFilePath = path.join(
    repoRoot,
    'docs/components',
    `${meta.kebabName}.md`
  )
  const testFilePath = path.join(repoRoot, 'tests', `${meta.kebabName}.spec.ts`)

  if (!(await pathExists(componentRoot))) {
    throw new Error(
      `Component not found: packages/components/${meta.kebabName}`
    )
  }

  const componentsIndexSource = await readFile(componentsIndexPath, 'utf8')
  const metadataSource = await readFile(metadataPath, 'utf8')
  const themeIndexSource = await readFile(themeIndexPath, 'utf8')

  const nextComponentsIndex = removeLine(
    componentsIndexSource,
    `export * from './${meta.kebabName}'`
  )
  const nextMetadata = removeMetadataEntry(metadataSource, meta.kebabName)
  const nextThemeIndex = removeStyleUseLine(themeIndexSource, meta.kebabName)

  const deleteTargets = [componentRoot]

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
    console.log(`Update: ${path.relative(repoRoot, componentsIndexPath)}`)
    console.log(`Update: ${path.relative(repoRoot, metadataPath)}`)
    console.log(`Update: ${path.relative(repoRoot, themeIndexPath)}`)
    return
  }

  await Promise.all(
    deleteTargets.map((target) => rm(target, { recursive: true, force: true }))
  )

  await writeFile(componentsIndexPath, nextComponentsIndex, 'utf8')
  await writeFile(metadataPath, nextMetadata, 'utf8')
  await writeFile(themeIndexPath, nextThemeIndex, 'utf8')

  console.log(`Deleted component: ${meta.componentName}`)
  deleteTargets.forEach((target) => {
    console.log(`- ${path.relative(repoRoot, target)}`)
  })
  console.log('Updated: packages/components/index.ts')
  console.log('Updated: packages/components/metadata.ts')
  console.log('Updated: packages/theme-chalk/src/index.scss')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
