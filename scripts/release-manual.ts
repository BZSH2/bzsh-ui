import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')

function run(cmd: string, args: string[] = [], options: Record<string, unknown> = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: process.platform === 'win32' ? 'powershell.exe' : true,
    ...options
  })
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

function hasPendingChangesets() {
  try {
    const { status } = spawnSync('npx', ['changeset', 'status'], {
      cwd: projectRoot,
      shell: process.platform === 'win32' ? 'powershell.exe' : true
    })
    return status === 0
  } catch {
    return false
  }
}

type VersionType = 'patch' | 'minor' | 'major'
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
    const gitStatus = spawnSync('git', ['status', '--porcelain'], {
      cwd: projectRoot,
      encoding: 'utf-8'
    })
    if (gitStatus.stdout.trim()) {
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
    if (message) {
      console.log('→ Creating changeset...')
      run('pnpm', ['changeset:auto', versionType, message, '--package', 'bzsh-ui'])
    }
  }

  console.log('→ Bumping version...')
  run('pnpm', ['version-packages'])

  const newPkg = JSON.parse(readFileSync(resolve(projectRoot, 'packages', 'ui', 'package.json'), 'utf-8'))
  const newVersion = newPkg.version
  const newTag = `v${newVersion}`

  console.log('→ Committing changes...')
  run('git', ['add', '.'])
  run('git', ['commit', '-m', `chore: release ${newTag}`])

  console.log('→ Pushing to origin...')
  run('git', ['push', 'origin', 'master'])

  console.log(`✅ Version commit ${newTag} pushed successfully`)
  console.log('The auto-release workflow will create the tag and GitHub Release on CI.')
}

main()
