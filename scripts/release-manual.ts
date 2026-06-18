import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')
const changesetDir = resolve(projectRoot, '.changeset')
const rootChangelogPath = resolve(projectRoot, 'CHANGELOG.md')

function resolveExecutable(cmd: string) {
  if (process.platform === 'win32' && (cmd === 'pnpm' || cmd === 'npx')) {
    return `${cmd}.cmd`
  }
  return cmd
}

function run(cmd: string, args: string[] = [], options: Record<string, unknown> = {}) {
  const executable = resolveExecutable(cmd)
  const result = spawnSync(executable, args, {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: process.platform === 'win32' && executable.endsWith('.cmd'),
    ...options
  })
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

function hasPendingChangesets() {
  try {
    return readdirSync(changesetDir).some((file) => file.endsWith('.md') && file !== 'README.md')
  } catch {
    return false
  }
}

function hasWorkingTreeChanges() {
  const result = spawnSync('git', ['status', '--porcelain'], {
    cwd: projectRoot,
    encoding: 'utf-8'
  })

  return result.stdout.trim().length > 0
}

function getDefaultChangesetSummary() {
  const result = spawnSync('git', ['log', '-1', '--pretty=%s'], {
    cwd: projectRoot,
    encoding: 'utf-8'
  })

  const summary = result.stdout.trim()
  return summary || 'release updates'
}

type VersionType = 'patch' | 'minor' | 'major'
type PendingChange = {
  bumpType: VersionType
  summary: string
}
const validVersionTypes = ['patch', 'minor', 'major'] as const

function isVersionType(value: string): value is VersionType {
  return validVersionTypes.includes(value as VersionType)
}

function getNextVersionFromArgs() {
  const args = process.argv.slice(2)
  let versionType: VersionType = 'patch'
  let message = ''

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (isVersionType(arg)) {
      versionType = arg
    } else if (arg === '--version' && args[i + 1]) {
      i += 1
    } else if (!arg.startsWith('--')) {
      message = arg
    }
  }

  return { versionType, message }
}

function getPendingChanges() {
  try {
    return readdirSync(changesetDir)
      .filter((file) => file.endsWith('.md') && file !== 'README.md')
      .map((file) => {
        const content = readFileSync(resolve(changesetDir, file), 'utf-8')
        const match = content.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/)
        const frontmatter = match?.[1] ?? ''
        const summary = (match?.[2] ?? content).trim()
        const bumpTypeMatch = frontmatter.match(/:\s*(patch|minor|major)/)
        const bumpType = (bumpTypeMatch?.[1] ?? 'patch') as VersionType

        return {
          bumpType,
          summary,
        }
      })
      .filter((change) => change.summary.length > 0)
  } catch {
    return []
  }
}

function updateRootChangelog(version: string, changes: PendingChange[]) {
  const sections: Array<{ title: string; items: string[] }> = []
  const order: VersionType[] = ['major', 'minor', 'patch']
  const titleMap: Record<VersionType, string> = {
    major: 'Major Changes',
    minor: 'Minor Changes',
    patch: 'Patch Changes',
  }

  for (const bumpType of order) {
    const items = changes
      .filter((change) => change.bumpType === bumpType)
      .map((change) => change.summary.trim())

    if (items.length > 0) {
      sections.push({
        title: titleMap[bumpType],
        items,
      })
    }
  }

  if (sections.length === 0) {
    sections.push({
      title: 'Patch Changes',
      items: ['release updates'],
    })
  }

  const entryLines = [`## ${version}`, '']

  for (const section of sections) {
    entryLines.push(`### ${section.title}`, '')
    for (const item of section.items) {
      entryLines.push(`- ${item}`)
    }
    entryLines.push('')
  }

  const entry = `${entryLines.join('\n').trimEnd()}\n\n`
  const existing = existsSync(rootChangelogPath)
    ? readFileSync(rootChangelogPath, 'utf-8')
    : '# bzsh-ui\n\n'

  if (!existing.trim()) {
    writeFileSync(rootChangelogPath, `# bzsh-ui\n\n${entry}`, 'utf-8')
    return
  }

  const normalized = existing.replace(/\r\n/g, '\n')
  const headingMatch = normalized.match(/^(# .+\n\n?)/)

  if (!headingMatch) {
    writeFileSync(rootChangelogPath, `# bzsh-ui\n\n${entry}${normalized.trimStart()}\n`, 'utf-8')
    return
  }

  const heading = headingMatch[1]
  const rest = normalized.slice(heading.length).trimStart()
  const nextContent = rest ? `${heading}${entry}${rest}\n` : `${heading}${entry}`
  writeFileSync(rootChangelogPath, nextContent, 'utf-8')
}

function main() {
  console.log('→ Checking required tools...')

  try {
    run('git', ['--version'])
  } catch {
    console.error('Error: git is not installed or not in PATH')
    process.exit(1)
  }

  const { versionType, message } = getNextVersionFromArgs()

  console.log('→ Checking working directory status...')
  try {
    if (hasWorkingTreeChanges()) {
      console.error('Error: Working directory is not clean. Please commit or stash your changes first.')
      process.exit(1)
    }
  } catch {
    console.error('Error: Failed to check git status')
    process.exit(1)
  }

  console.log('→ Pulling latest changes...')
  run('git', ['pull', 'origin', 'master'])

  const hasChangesets = hasPendingChangesets()
  if (!hasChangesets) {
    const summary = message || getDefaultChangesetSummary()
    console.log(`→ Creating changeset automatically: ${summary}`)
    run('pnpm', ['changeset:auto', versionType, summary, '--package', 'bzsh-ui'])
  }

  const pendingChanges = getPendingChanges()

  console.log('→ Bumping version...')
  run('pnpm', ['version-packages'])

  if (!hasWorkingTreeChanges()) {
    console.error('Error: No version files were updated, nothing to release.')
    process.exit(1)
  }

  const newPkg = JSON.parse(readFileSync(resolve(projectRoot, 'packages', 'ui', 'package.json'), 'utf-8'))
  const newVersion = newPkg.version
  const newTag = `v${newVersion}`

  console.log('→ Updating root changelog...')
  updateRootChangelog(newVersion, pendingChanges)

  console.log('→ Committing changes...')
  run('git', ['add', '.'])
  run('git', ['commit', '-m', `chore: release ${newTag}`])

  console.log('→ Pushing to origin...')
  run('git', ['push', 'origin', 'master'])

  console.log(`✅ Version commit ${newTag} pushed successfully`)
  console.log('The auto-release workflow will create the tag and GitHub Release on CI.')
}

main()
