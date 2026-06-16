import { readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const componentsIndexPath = path.join(repoRoot, 'packages/components/index.ts')
const defaultsPath = path.join(repoRoot, 'packages/bzsh-ui/defaults.ts')
const themeIndexPath = path.join(
  repoRoot,
  'packages/theme-chalk/src/index.scss'
)
const docsConfigPath = path.join(repoRoot, 'docs/.vitepress/config.ts')
const docsIndexPath = path.join(repoRoot, 'docs/index.md')

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

function getRemainingComponentNames(source, removedName) {
  const match = source.match(/import\s+\{([^}]+)\}\s+from\s+'\.\.\/components'/)

  if (!match) {
    return []
  }

  return match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item !== removedName)
}

function updateDefaults(source, componentName) {
  const remainingNames = getRemainingComponentNames(source, componentName)

  if (remainingNames.length === 0) {
    return source
      .replace(/import\s+\{[^}]+\}\s+from\s+'\.\.\/components'\n\n/, '')
      .replace(
        /export const defaultComponents = \[[^\]]*\]/,
        'export const defaultComponents = []'
      )
  }

  return source
    .replace(
      /import\s+\{[^}]+\}\s+from\s+'\.\.\/components'/,
      `import { ${remainingNames.join(', ')} } from '../components'`
    )
    .replace(
      /export const defaultComponents = \[[^\]]*\]/,
      `export const defaultComponents = [${remainingNames.join(', ')}]`
    )
}

function getFirstRemainingKebab(componentsIndexSource, removedKebabName) {
  const matches = [
    ...componentsIndexSource.matchAll(/export \* from '\.\/([^']+)'/g)
  ]
  const remaining = matches
    .map((match) => match[1])
    .filter((name) => name !== removedKebabName)

  return remaining[0]
}

function updateDocsConfig(source, kebabName, nextNavKebabName) {
  const nextNavLink = nextNavKebabName
    ? `/components/${nextNavKebabName}`
    : '/guide/getting-started'

  const removedComponentLink = `/components/${kebabName}`

  let result = source.replace(
    /(\{ text: '组件', link: ')[^']+(' \})/,
    `$1${nextNavLink}$2`
  )

  result = result
    .split('\n')
    .filter((line) => !line.includes(`link: '${removedComponentLink}'`))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')

  result = result.replace(/,\s*\]/g, '\n          ]')

  return result
}

function removeDocsIndexEntry(source, kebabName) {
  return source
    .split('\n')
    .filter((line) => !line.includes(`(./components/${kebabName})`))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
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
  const defaultsSource = await readFile(defaultsPath, 'utf8')
  const themeIndexSource = await readFile(themeIndexPath, 'utf8')
  const docsConfigSource = await readFile(docsConfigPath, 'utf8')
  const docsIndexSource = await readFile(docsIndexPath, 'utf8')

  const nextComponentsIndex = removeLine(
    componentsIndexSource,
    `export * from './${meta.kebabName}'`
  )
  const nextDefaults = updateDefaults(defaultsSource, meta.componentName)
  const nextThemeIndex = removeLine(
    themeIndexSource,
    `@use '../../components/${meta.kebabName}/style/index';`
  )
  const nextNavKebabName = getFirstRemainingKebab(
    componentsIndexSource,
    meta.kebabName
  )
  const nextDocsConfig = updateDocsConfig(
    docsConfigSource,
    meta.kebabName,
    nextNavKebabName
  )
  const nextDocsIndex = removeDocsIndexEntry(docsIndexSource, meta.kebabName)

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
    console.log(`Update: ${path.relative(repoRoot, defaultsPath)}`)
    console.log(`Update: ${path.relative(repoRoot, themeIndexPath)}`)
    console.log(`Update: ${path.relative(repoRoot, docsConfigPath)}`)
    console.log(`Update: ${path.relative(repoRoot, docsIndexPath)}`)
    return
  }

  await Promise.all(
    deleteTargets.map((target) => rm(target, { recursive: true, force: true }))
  )

  await writeFile(componentsIndexPath, nextComponentsIndex, 'utf8')
  await writeFile(defaultsPath, nextDefaults, 'utf8')
  await writeFile(themeIndexPath, nextThemeIndex, 'utf8')
  await writeFile(docsConfigPath, nextDocsConfig, 'utf8')
  await writeFile(docsIndexPath, nextDocsIndex, 'utf8')

  console.log(`Deleted component: ${meta.componentName}`)
  deleteTargets.forEach((target) => {
    console.log(`- ${path.relative(repoRoot, target)}`)
  })
  console.log('Updated: packages/components/index.ts')
  console.log('Updated: packages/bzsh-ui/defaults.ts')
  console.log('Updated: packages/theme-chalk/src/index.scss')
  console.log('Updated: docs/.vitepress/config.ts')
  console.log('Updated: docs/index.md')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
