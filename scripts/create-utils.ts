import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const utilsDir = path.join(repoRoot, 'packages/utils')
const utilsIndexPath = path.join(utilsDir, 'index.ts')
const typeGuardsDir = path.join(utilsDir, 'type-guards')
const typeGuardsIndexPath = path.join(typeGuardsDir, 'index.ts')
const typeUtilsDir = path.join(utilsDir, 'type-utils')
const typeUtilsIndexPath = path.join(typeUtilsDir, 'index.ts')

type UtilCategory = 'root' | 'type-utils' | 'type-guards'

type UtilMeta = {
  category: UtilCategory
  fileName: string
  functionName: string
  propertyName?: string
}

function printUsage(): void {
  console.log(`Usage:
  pnpm utils <name> [--dry-run]

Examples:
  pnpm utils isNumber
  pnpm utils is-string
  pnpm utils addUnit --dry-run`)
}

function parseArgs(argv: string[]): { dryRun: boolean; rawName: string } {
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
    rawName: nameArg.trim(),
  }
}

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .split('-')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function isTypeGuardUtil(functionName: string): boolean {
  return /^is[A-Z]/.test(functionName)
}

function isTypeUtility(functionName: string): boolean {
  return functionName === 'getDataType'
}

function toPropertyName(functionName: string): string | undefined {
  if (!isTypeGuardUtil(functionName)) {
    return undefined
  }

  const suffix = functionName.slice(2)
  return suffix ? suffix.charAt(0).toLowerCase() + suffix.slice(1) : undefined
}

function resolveUtilMeta(rawName: string): UtilMeta {
  const words = splitWords(rawName)

  if (words.length === 0) {
    throw new Error(`Invalid util name "${rawName}".`)
  }

  const fileName = words.join('-')
  const functionName = words
    .map((word, index) => (index === 0 ? word : capitalize(word)))
    .join('')

  return {
    category: isTypeGuardUtil(functionName)
      ? 'type-guards'
      : isTypeUtility(functionName)
        ? 'type-utils'
        : 'root',
    fileName,
    functionName,
    propertyName: toPropertyName(functionName),
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

function buildUtilTemplate(functionName: string): string {
  return `export function ${functionName}(...args: unknown[]): never {
  void args
  throw new Error('Method "${functionName}" is not implemented.')
}
`
}

async function readFileIfExists(targetPath: string): Promise<string> {
  if (!(await pathExists(targetPath))) {
    return ''
  }

  return readFile(targetPath, 'utf8')
}

function addExportIfMissing(source: string, fileName: string): string {
  const exportLine = `export * from './${fileName}'`

  if (source.includes(exportLine)) {
    return source
  }

  return source.trimEnd() + `\n${exportLine}\n`
}

function addTypeGuardsIndexEntryIfMissing(source: string, meta: UtilMeta): string {
  if (meta.category !== 'type-guards' || !meta.propertyName) {
    return source
  }

  const exportLine = `export * from './${meta.fileName}'`
  const importLine = `import { ${meta.functionName} } from './${meta.fileName}'`
  const objectLine = `  ${meta.propertyName}: ${meta.functionName},`

  let nextSource = source

  if (!nextSource.includes(exportLine)) {
    const firstImportIndex = nextSource.indexOf('import ')
    nextSource =
      firstImportIndex >= 0
        ? `${nextSource.slice(0, firstImportIndex)}${exportLine}\n${nextSource.slice(firstImportIndex)}`
        : `${nextSource.trimEnd()}\n${exportLine}\n`
  }

  if (!nextSource.includes(importLine)) {
    const objectCommentIndex = nextSource.indexOf('/**')
    nextSource =
      objectCommentIndex >= 0
        ? `${nextSource.slice(0, objectCommentIndex).trimEnd()}\n${importLine}\n\n${nextSource.slice(objectCommentIndex)}`
        : `${nextSource.trimEnd()}\n${importLine}\n`
  }

  if (!nextSource.includes(objectLine)) {
    const objectEndIndex = nextSource.indexOf('} as const')
    nextSource =
      objectEndIndex >= 0
        ? `${nextSource.slice(0, objectEndIndex)}${objectLine}\n${nextSource.slice(objectEndIndex)}`
        : `${nextSource.trimEnd()}\n${objectLine}\n`
  }

  return nextSource
}

async function main(): Promise<void> {
  const { rawName, dryRun } = parseArgs(process.argv.slice(2))
  const meta = resolveUtilMeta(rawName)
  const targetDir =
    meta.category === 'type-guards'
      ? typeGuardsDir
      : meta.category === 'type-utils'
        ? typeUtilsDir
        : utilsDir
  const utilFilePath = path.join(targetDir, `${meta.fileName}.ts`)
  const targetIndexPath =
    meta.category === 'type-guards'
      ? typeGuardsIndexPath
      : meta.category === 'type-utils'
        ? typeUtilsIndexPath
        : utilsIndexPath

  if (await pathExists(utilFilePath)) {
    throw new Error(
      `Util already exists: ${path.relative(repoRoot, utilFilePath).replaceAll('\\', '/')}`
    )
  }

  const targetIndexSource = await readFileIfExists(targetIndexPath)
  const nextTargetIndex =
    meta.category === 'type-guards'
      ? addTypeGuardsIndexEntryIfMissing(targetIndexSource, meta)
      : addExportIfMissing(targetIndexSource, meta.fileName)
  const utilsIndexSource = await readFile(utilsIndexPath, 'utf8')
  const nextUtilsIndex =
    meta.category === 'type-utils'
      ? addExportIfMissing(utilsIndexSource, 'type-utils')
      : meta.category === 'type-guards'
        ? addExportIfMissing(utilsIndexSource, 'type-guards')
      : utilsIndexSource
  const utilTemplate = buildUtilTemplate(meta.functionName)
  const relativeUtilPath = path.relative(repoRoot, utilFilePath).replaceAll('\\', '/')
  const relativeIndexPath = path.relative(repoRoot, targetIndexPath).replaceAll('\\', '/')

  if (dryRun) {
    console.log('# Dry Run')
    console.log(`Function: ${meta.functionName}`)
    console.log(`Category: ${meta.category}`)
    console.log(`Create: ${relativeUtilPath}`)
    console.log(`Update: ${relativeIndexPath}`)
    if (meta.category === 'type-utils' || meta.category === 'type-guards') {
      console.log('Update: packages/utils/index.ts')
    }
    return
  }

  await mkdir(targetDir, { recursive: true })
  await writeFile(utilFilePath, utilTemplate, 'utf8')
  await writeFile(targetIndexPath, nextTargetIndex, 'utf8')

  if (meta.category === 'type-utils' || meta.category === 'type-guards') {
    await writeFile(utilsIndexPath, nextUtilsIndex, 'utf8')
  }

  console.log(`Created util scaffold: ${meta.functionName}`)
  console.log(`- ${relativeUtilPath}`)
  console.log(`Updated: ${relativeIndexPath}`)
  if (meta.category === 'type-utils' || meta.category === 'type-guards') {
    console.log('Updated: packages/utils/index.ts')
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
