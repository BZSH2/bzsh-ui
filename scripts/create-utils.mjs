import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const utilsDir = path.join(repoRoot, 'packages/utils')
const utilsIndexPath = path.join(utilsDir, 'index.ts')

function printUsage() {
  console.log(`Usage:
  pnpm utils <name> [--dry-run]

Examples:
  pnpm utils isNumber
  pnpm utils is-string
  pnpm utils addUnit --dry-run`)
}

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(argv.length === 0 ? 1 : 0)
  }

  const dryRun = argv.includes('--dry-run')
  const nameArg = argv.find((arg) => !arg.startsWith('-'))

  if (!nameArg) {
    throw new Error('Missing util name.')
  }

  return {
    dryRun,
    rawName: nameArg.trim()
  }
}

function splitWords(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .split('-')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function resolveUtilMeta(rawName) {
  const words = splitWords(rawName)

  if (words.length === 0) {
    throw new Error(`Invalid util name "${rawName}".`)
  }

  const fileName = words.join('-')
  const functionName = words
    .map((word, index) => (index === 0 ? word : capitalize(word)))
    .join('')

  return {
    fileName,
    functionName
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

function buildUtilTemplate(functionName) {
  return `export function ${functionName}(...args: unknown[]): never {
  void args
  throw new Error('Method "${functionName}" is not implemented.')
}
`
}

function addExportIfMissing(source, fileName) {
  const exportLine = `export * from './${fileName}'`

  if (source.includes(exportLine)) {
    return source
  }

  return source.trimEnd() + `\n${exportLine}\n`
}

async function main() {
  const { rawName, dryRun } = parseArgs(process.argv.slice(2))
  const meta = resolveUtilMeta(rawName)
  const utilFilePath = path.join(utilsDir, `${meta.fileName}.ts`)

  if (await pathExists(utilFilePath)) {
    throw new Error(`Util already exists: packages/utils/${meta.fileName}.ts`)
  }

  const utilsIndexSource = await readFile(utilsIndexPath, 'utf8')
  const nextUtilsIndex = addExportIfMissing(utilsIndexSource, meta.fileName)
  const utilTemplate = buildUtilTemplate(meta.functionName)

  if (dryRun) {
    console.log('# Dry Run')
    console.log(`Function: ${meta.functionName}`)
    console.log(`Create: packages/utils/${meta.fileName}.ts`)
    console.log('Update: packages/utils/index.ts')
    return
  }

  await mkdir(utilsDir, { recursive: true })
  await writeFile(utilFilePath, utilTemplate, 'utf8')
  await writeFile(utilsIndexPath, nextUtilsIndex, 'utf8')

  console.log(`Created util scaffold: ${meta.functionName}`)
  console.log(`- packages/utils/${meta.fileName}.ts`)
  console.log('Updated: packages/utils/index.ts')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
