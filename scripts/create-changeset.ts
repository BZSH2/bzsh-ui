import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type BumpType = 'patch' | 'minor' | 'major'

const VALID_BUMP_TYPES = new Set<BumpType>(['patch', 'minor', 'major'])

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const changesetDir = path.join(repoRoot, '.changeset')

function printUsage(): void {
  console.log(`Usage:
  pnpm changeset:auto <patch|minor|major> "<summary>" [--package <name>] [--dry-run]

Examples:
  pnpm changeset:auto patch "修复按钮样式问题"
  pnpm changeset:auto minor "新增 Input 组件"
  pnpm changeset:auto major "重构 Button API"
  pnpm changeset:auto patch "修复发布流程" --dry-run`)
}

function parseArgs(argv: string[]): {
  bumpType: BumpType
  summary: string
  packageName?: string
  dryRun: boolean
} {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(argv.length === 0 ? 1 : 0)
  }

  const [bumpType, ...rest] = argv

  if (!bumpType || !VALID_BUMP_TYPES.has(bumpType as BumpType)) {
    throw new Error(
      `Invalid bump type "${bumpType}". Use patch, minor, or major.`
    )
  }

  const messageParts: string[] = []
  let packageName: string | undefined
  let dryRun = false

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index]

    if (arg === '--dry-run') {
      dryRun = true
      continue
    }

    if (arg === '--package' || arg === '-p') {
      packageName = rest[index + 1]
      index += 1
      continue
    }

    if (arg.startsWith('--package=')) {
      packageName = arg.slice('--package='.length)
      continue
    }

    messageParts.push(arg)
  }

  const summary = messageParts.join(' ').trim()

  if (!summary) {
    throw new Error('Missing changeset summary. Wrap the summary in quotes.')
  }

  if (packageName !== undefined && packageName.trim() === '') {
    throw new Error('The package name after --package cannot be empty.')
  }

  return {
    bumpType: bumpType as BumpType,
    summary,
    packageName: packageName?.trim(),
    dryRun,
  }
}

async function getDefaultPackageName(): Promise<string> {
  const packageJsonPath = path.join(repoRoot, 'package.json')
  const packageJson = JSON.parse(
    await readFile(packageJsonPath, 'utf8')
  ) as { name?: string }

  if (!packageJson.name) {
    throw new Error('Cannot find package name in package.json.')
  }

  return packageJson.name
}

function buildChangesetContent(
  packageName: string,
  bumpType: BumpType,
  summary: string
): string {
  return `---
"${packageName}": ${bumpType}
---

${summary}
`
}

function buildFileName(summary: string): string {
  const normalized = summary
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const prefix = normalized ? normalized.slice(0, 32) : 'release'
  return `${prefix || 'release'}-${randomUUID().slice(0, 8)}.md`
}

async function main(): Promise<void> {
  const { bumpType, summary, packageName, dryRun } = parseArgs(
    process.argv.slice(2)
  )
  const resolvedPackageName = packageName ?? (await getDefaultPackageName())
  const fileName = buildFileName(summary)
  const filePath = path.join(changesetDir, fileName)
  const content = buildChangesetContent(resolvedPackageName, bumpType, summary)

  if (dryRun) {
    console.log(`# Dry Run`)
    console.log(`File: ${path.relative(repoRoot, filePath)}`)
    console.log('')
    process.stdout.write(content)
    return
  }

  await mkdir(changesetDir, { recursive: true })
  await writeFile(filePath, content, 'utf8')

  console.log(`Created changeset: ${path.relative(repoRoot, filePath)}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
