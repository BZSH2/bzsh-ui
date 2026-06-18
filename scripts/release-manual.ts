import { spawnSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { repoRoot, uiPackageDir } from '../tooling/config/project-paths'

type BumpType = 'patch' | 'minor' | 'major'

type ParsedArgs = {
  branch: string
  bumpType?: BumpType
  dryRun: boolean
  expectedVersion?: string
  notes?: string
  preparedOnly: boolean
  remote: string
  skipChangeset: boolean
  summary: string
}

type PackageInfo = {
  name: string
  version: string
}

type ReleaseCreationMode = 'gh' | 'web'

type ParsedVersion = {
  major: number
  minor: number
  patch: number
  prerelease?: string
}

const VALID_BUMP_TYPES = new Set<BumpType>(['patch', 'minor', 'major'])
const changesetDir = path.join(repoRoot, '.changeset')
const uiPackageJsonPath = path.join(uiPackageDir, 'package.json')

/**
 * 打印脚本使用说明
 */
function printUsage(): void {
  console.log(`Usage:
  pnpm ship
  pnpm ship --dry-run
  pnpm ship <patch|minor|major> "<summary>" [--dry-run] [--version <x.y.z>] [--branch <name>] [--remote <name>] [--notes "<text>"]
  pnpm ship --skip-changeset [--dry-run] [--version <x.y.z>] [--branch <name>] [--remote <name>] [--notes "<text>"]

Examples:
  pnpm ship
  pnpm ship patch "修复按钮样式问题"
  pnpm ship minor "新增表单组件"
  pnpm ship minor "新增表单组件" --version 0.2.0
  pnpm ship --skip-changeset
  pnpm ship patch "修复发布流程" --dry-run`)
}

/**
 * 解析命令行参数
 * @param argv 命令行参数数组
 * @returns 解析后的参数对象
 */
function parseArgs(argv: string[]): ParsedArgs {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  let branch = 'master'
  let bumpType: BumpType | undefined
  let dryRun = false
  let expectedVersion: string | undefined
  let notes: string | undefined
  let remote = 'origin'
  let skipChangeset = false
  const summaryParts: string[] = []

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--dry-run') {
      dryRun = true
      continue
    }

    if (arg === '--skip-changeset') {
      skipChangeset = true
      continue
    }

    if (arg === '--branch') {
      branch = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (arg.startsWith('--branch=')) {
      branch = arg.slice('--branch='.length)
      continue
    }

    if (arg === '--remote') {
      remote = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (arg.startsWith('--remote=')) {
      remote = arg.slice('--remote='.length)
      continue
    }

    if (arg === '--notes') {
      notes = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (arg.startsWith('--notes=')) {
      notes = arg.slice('--notes='.length)
      continue
    }

    if (arg === '--version') {
      expectedVersion = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (arg.startsWith('--version=')) {
      expectedVersion = arg.slice('--version='.length)
      continue
    }

    if (!bumpType && VALID_BUMP_TYPES.has(arg as BumpType)) {
      bumpType = arg as BumpType
      continue
    }

    summaryParts.push(arg)
  }

  const summary = summaryParts.join(' ').trim()
  const preparedOnly = !bumpType && !summary && !skipChangeset

  if (!branch.trim()) {
    throw new Error('The branch name cannot be empty.')
  }

  if (!remote.trim()) {
    throw new Error('The remote name cannot be empty.')
  }

  if (!preparedOnly && !skipChangeset && !bumpType) {
    throw new Error('Missing bump type. Use patch, minor, or major.')
  }

  if (!preparedOnly && !skipChangeset && !summary) {
    throw new Error('Missing release summary. Wrap the summary in quotes.')
  }

  return {
    branch: branch.trim(),
    bumpType,
    dryRun,
    expectedVersion: expectedVersion?.trim() || undefined,
    notes: notes?.trim() || undefined,
    preparedOnly,
    remote: remote.trim(),
    skipChangeset,
    summary,
  }
}

/**
 * 运行命令并在失败时抛出错误
 * @param bin 可执行文件名称
 * @param args 命令参数
 * @param options 运行配置
 * @returns 可选的标准输出内容
 */
function runCommand(
  bin: string,
  args: string[],
  options: { captureOutput?: boolean; dryRun?: boolean } = {}
): string {
  const commandText = `${bin} ${args.join(' ')}`

  if (options.dryRun) {
    console.log(`[dry-run] ${commandText}`)
    return ''
  }

  const result = spawnSync(bin, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: options.captureOutput ? 'pipe' : 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    throw new Error(stderr || `Command failed: ${commandText}`)
  }

  return result.stdout?.trim() ?? ''
}

/**
 * 检查命令是否可用
 * @param bin 可执行文件名称
 */
function assertCommandAvailable(bin: string): void {
  try {
    runCommand(bin, ['--version'], { captureOutput: true })
  } catch {
    throw new Error(`Required command "${bin}" is not available in PATH.`)
  }
}

/**
 * 检查命令是否存在
 * @param bin 可执行文件名称
 * @returns 如果命令可用则返回 true
 */
function hasCommandAvailable(bin: string): boolean {
  try {
    runCommand(bin, ['--version'], { captureOutput: true })
    return true
  } catch {
    return false
  }
}

/**
 * 确认工作区干净，避免把无关改动一起发版
 */
function assertCleanWorkingTree(): void {
  const status = runCommand('git', ['status', '--short'], { captureOutput: true })

  if (status) {
    throw new Error('Working tree is not clean. Commit or stash changes before releasing.')
  }
}

/**
 * 确认当前分支正确
 * @param expectedBranch 预期分支名称
 */
function assertCurrentBranch(expectedBranch: string): void {
  const currentBranch = runCommand('git', ['branch', '--show-current'], { captureOutput: true })

  if (currentBranch !== expectedBranch) {
    throw new Error(`Release must run on branch "${expectedBranch}", current branch is "${currentBranch}".`)
  }
}

/**
 * 拉取远程分支和 tag，确保后续比较基于最新远程状态
 * @param remote 远程仓库名称
 * @param branch 目标分支名称
 */
function fetchRemoteReleaseRefs(remote: string, branch: string): void {
  runCommand('git', ['fetch', remote, branch, '--tags'])
}

/**
 * 确认本地 HEAD 与远程分支完全一致
 * @param remote 远程仓库名称
 * @param branch 目标分支名称
 */
function assertLocalBranchUpToDate(remote: string, branch: string): void {
  const localHead = runCommand('git', ['rev-parse', 'HEAD'], { captureOutput: true })
  const remoteHead = runCommand('git', ['rev-parse', `${remote}/${branch}`], { captureOutput: true })

  if (localHead !== remoteHead) {
    throw new Error(
      `Local branch is not in sync with ${remote}/${branch}. Pull or push the latest changes before releasing.`
    )
  }
}

/**
 * 读取对外发布包的信息
 * @returns 发布包名称和版本
 */
async function readReleasePackageInfo(): Promise<PackageInfo> {
  const packageJson = JSON.parse(await readFile(uiPackageJsonPath, 'utf8')) as {
    name?: string
    version?: string
  }

  if (!packageJson.name || !packageJson.version) {
    throw new Error('Cannot read release package name or version from packages/ui/package.json.')
  }

  return {
    name: packageJson.name,
    version: packageJson.version,
  }
}

/**
 * 检查仓库中是否存在待发布的 changeset 文件
 * @returns 如果存在待发布 changeset 则返回 true
 */
async function hasPendingChangesets(): Promise<boolean> {
  try {
    const entries = await readdir(changesetDir, { withFileTypes: true })

    return entries.some(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        entry.name.toLowerCase() !== 'readme.md'
    )
  } catch {
    return false
  }
}

/**
 * 检查 tag 是否已经存在
 * @param tagName 目标 tag 名称
 */
function assertTagNotExists(tagName: string): void {
  const existingTag = runCommand('git', ['tag', '--list', tagName], { captureOutput: true })

  if (existingTag) {
    throw new Error(`Tag "${tagName}" already exists.`)
  }
}

/**
 * 检查远程仓库中是否已存在同名 tag
 * @param remote 远程仓库名称
 * @param tagName 目标 tag 名称
 */
function assertRemoteTagNotExists(remote: string, tagName: string): void {
  const remoteTag = runCommand(
    'git',
    ['ls-remote', '--tags', remote, `refs/tags/${tagName}`],
    { captureOutput: true }
  )

  if (remoteTag) {
    throw new Error(`Remote tag "${tagName}" already exists on ${remote}. Choose a newer version before releasing.`)
  }
}

/**
 * 检查 GitHub Release 是否已存在
 * @param tagName 目标 tag 名称
 */
function assertGithubReleaseNotExists(tagName: string): void {
  const result = spawnSync('gh', ['release', 'view', tagName], {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: 'pipe',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status === 0) {
    throw new Error(`GitHub Release "${tagName}" already exists. Avoid publishing the same release twice.`)
  }
}

/**
 * 读取 git remote URL
 * @param remote 远程仓库名称
 * @returns 远程仓库地址
 */
function getRemoteUrl(remote: string): string {
  return runCommand('git', ['remote', 'get-url', remote], { captureOutput: true })
}

/**
 * 从 git remote URL 提取 GitHub 仓库路径
 * @param remoteUrl git remote 地址
 * @returns owner/repo 路径
 */
function parseGithubRepoPath(remoteUrl: string): string {
  const normalized = remoteUrl.trim()
  const sshMatch = normalized.match(/^git@github\.com:(.+?)(?:\.git)?$/)

  if (sshMatch) {
    return sshMatch[1]
  }

  const httpsMatch = normalized.match(/^https:\/\/github\.com\/(.+?)(?:\.git)?$/)

  if (httpsMatch) {
    return httpsMatch[1]
  }

  throw new Error(`Cannot derive GitHub repository path from remote URL "${remoteUrl}".`)
}

/**
 * 构建 GitHub Release 创建页面链接
 * @param remote 远程仓库名称
 * @param tagName 目标 tag
 * @param title Release 标题
 * @returns 可直接打开的 Release 创建链接
 */
function buildGithubReleaseUrl(remote: string, tagName: string, title: string): string {
  const remoteUrl = getRemoteUrl(remote)
  const repoPath = parseGithubRepoPath(remoteUrl)
  const search = new URLSearchParams({
    tag: tagName,
    title,
  })

  return `https://github.com/${repoPath}/releases/new?${search.toString()}`
}

/**
 * 尝试打开浏览器访问指定链接
 * @param url 目标链接
 */
function openUrl(url: string): void {
  if (process.platform === 'win32') {
    spawnSync('powershell', ['-NoProfile', '-Command', 'Start-Process', url], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: 'ignore',
    })
    return
  }

  if (process.platform === 'darwin') {
    spawnSync('open', [url], { cwd: repoRoot, encoding: 'utf8', stdio: 'ignore' })
    return
  }

  spawnSync('xdg-open', [url], { cwd: repoRoot, encoding: 'utf8', stdio: 'ignore' })
}

/**
 * 读取仓库中最新的发布 tag
 * @returns 最新 tag，如果不存在则返回 undefined
 */
function getLatestReleaseTag(): string | undefined {
  const tags = runCommand('git', ['tag', '--list', 'v*', '--sort=-v:refname'], { captureOutput: true })
    .split('\n')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return tags[0]
}

/**
 * 解析语义化版本号
 * @param input 版本号或 tag
 * @returns 解析后的版本对象
 */
function parseVersion(input: string): ParsedVersion {
  const normalized = input.startsWith('v') ? input.slice(1) : input
  const match = normalized.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/)

  if (!match) {
    throw new Error(`Invalid semantic version "${input}".`)
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4],
  }
}

/**
 * 比较两个版本号大小
 * @param left 左侧版本
 * @param right 右侧版本
 * @returns 大于返回 1，小于返回 -1，相等返回 0
 */
function compareVersions(left: string, right: string): number {
  const leftVersion = parseVersion(left)
  const rightVersion = parseVersion(right)

  const fields: Array<keyof Pick<ParsedVersion, 'major' | 'minor' | 'patch'>> = [
    'major',
    'minor',
    'patch',
  ]

  for (const field of fields) {
    if (leftVersion[field] > rightVersion[field]) {
      return 1
    }

    if (leftVersion[field] < rightVersion[field]) {
      return -1
    }
  }

  if (leftVersion.prerelease && !rightVersion.prerelease) {
    return -1
  }

  if (!leftVersion.prerelease && rightVersion.prerelease) {
    return 1
  }

  if (leftVersion.prerelease && rightVersion.prerelease) {
    return leftVersion.prerelease.localeCompare(rightVersion.prerelease)
  }

  return 0
}

/**
 * 校验 tag 与当前包版本完全一致
 * @param tagName 目标 tag
 * @param version 当前包版本
 */
function assertTagMatchesPackageVersion(tagName: string, version: string): void {
  const expectedTag = `v${version}`

  if (tagName !== expectedTag) {
    throw new Error(`Tag "${tagName}" does not match current package version "${version}".`)
  }
}

/**
 * 校验新版本必须大于仓库中最新的已发布 tag
 * @param nextVersion 即将发布的版本
 * @param latestTag 仓库中最新的 tag
 */
function assertVersionIsNewerThanLatestTag(nextVersion: string, latestTag?: string): void {
  if (!latestTag) {
    return
  }

  if (compareVersions(nextVersion, latestTag) <= 0) {
    throw new Error(
      `Next version "${nextVersion}" must be greater than latest released tag "${latestTag}".`
    )
  }
}

/**
 * 校验目标版本格式合法
 * @param expectedVersion 目标版本
 */
function assertExpectedVersionValid(expectedVersion?: string): void {
  if (!expectedVersion) {
    return
  }

  parseVersion(expectedVersion)
}

/**
 * 校验 changeset version 的结果和显式指定的版本一致
 * @param actualVersion 实际生成的版本
 * @param expectedVersion 期望的目标版本
 */
function assertExpectedVersionMatches(actualVersion: string, expectedVersion?: string): void {
  if (!expectedVersion) {
    return
  }

  if (actualVersion !== expectedVersion) {
    throw new Error(
      `Expected version "${expectedVersion}", but changeset generated "${actualVersion}".`
    )
  }
}

/**
 * 执行一键发布流程
 */
async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  assertExpectedVersionValid(options.expectedVersion)
  const hasGhCli = hasCommandAvailable('gh')
  const releaseCreationMode: ReleaseCreationMode = hasGhCli ? 'gh' : 'web'

  if (!options.dryRun) {
    assertCommandAvailable('git')
    assertCommandAvailable('pnpm')
    assertCleanWorkingTree()
    assertCurrentBranch(options.branch)
    fetchRemoteReleaseRefs(options.remote, options.branch)
    assertLocalBranchUpToDate(options.remote, options.branch)
  }

  const releasePackage = await readReleasePackageInfo()
  const pendingChangesets = await hasPendingChangesets()
  const shouldAutoVersion = !options.skipChangeset && !options.bumpType && !options.summary && pendingChangesets
  let nextReleasePackage = releasePackage
  let nextVersion = options.dryRun
    ? options.expectedVersion ?? releasePackage.version
    : releasePackage.version

  if (options.preparedOnly && !shouldAutoVersion) {
    if (!options.dryRun) {
      assertExpectedVersionMatches(releasePackage.version, options.expectedVersion)
    }
  } else {
    const previousVersion = releasePackage.version

    if (!options.skipChangeset && options.bumpType) {
      runCommand(
        'pnpm',
        ['changeset:auto', options.bumpType, options.summary, '--package', releasePackage.name],
        { dryRun: options.dryRun }
      )
    }

    runCommand('pnpm', ['version-packages'], { dryRun: options.dryRun })

    nextReleasePackage = options.dryRun
      ? releasePackage
      : await readReleasePackageInfo()

    if (!options.dryRun && nextReleasePackage.version === previousVersion) {
      throw new Error(
        'No version change detected after pnpm version-packages. Ensure a valid changeset exists.'
      )
    }

    if (!options.dryRun) {
      assertExpectedVersionMatches(nextReleasePackage.version, options.expectedVersion)
    }

    nextVersion = options.dryRun
      ? options.expectedVersion ?? '<new-version>'
      : nextReleasePackage.version
  }

  const tagName = `v${nextVersion}`
  const commitMessage = `chore: release ${tagName}`
  const releaseNotes = options.notes ?? (options.summary || `release ${tagName}`)

  if (!options.dryRun) {
    const latestReleaseTag = getLatestReleaseTag()
    assertTagMatchesPackageVersion(tagName, nextReleasePackage.version)
    assertVersionIsNewerThanLatestTag(nextReleasePackage.version, latestReleaseTag)
    assertTagNotExists(tagName)
    assertRemoteTagNotExists(options.remote, tagName)
    if (releaseCreationMode === 'gh') {
      assertGithubReleaseNotExists(tagName)
    }
  }

  if (!options.preparedOnly) {
    runCommand('git', ['add', '.'], { dryRun: options.dryRun })
    runCommand('git', ['commit', '-m', commitMessage], { dryRun: options.dryRun })
    runCommand('git', ['push', options.remote, options.branch], { dryRun: options.dryRun })
  }

  runCommand('git', ['tag', tagName], { dryRun: options.dryRun })
  runCommand('git', ['push', options.remote, tagName], { dryRun: options.dryRun })
  if (releaseCreationMode === 'gh') {
    runCommand(
      'gh',
      ['release', 'create', tagName, '--title', tagName, '--notes', releaseNotes],
      { dryRun: options.dryRun }
    )
  } else {
    const releaseUrl = buildGithubReleaseUrl(options.remote, tagName, tagName)

    if (options.dryRun) {
      console.log(`[dry-run] open ${releaseUrl}`)
    } else {
      openUrl(releaseUrl)
      console.log(`GitHub CLI (gh) is not installed. Opened the Release page for ${tagName}:`)
      console.log(releaseUrl)
      console.log('Publish the Release in your browser to trigger GitHub Actions.')
    }
  }

  console.log(
    options.dryRun
      ? 'Dry run finished. No files or remote state were changed.'
      : releaseCreationMode === 'gh'
        ? `Release ${tagName} has been created. GitHub Actions will publish it automatically.`
        : `Tag ${tagName} has been pushed. Finish creating the GitHub Release in your browser to trigger publishing.`
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
