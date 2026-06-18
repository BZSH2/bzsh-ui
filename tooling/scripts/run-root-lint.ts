import { spawnSync } from 'node:child_process'

import { rootLintIgnorePatterns, rootLintTargets } from '../config/lint'

/**
 * 可用的 lint 工具类型
 */
type LintTool = 'eslint' | 'stylelint'

/**
 * 要使用的 lint 工具
 */
const tool = process.argv[2] as LintTool | undefined
/**
 * 可能的 --fix 标志
 */
const maybeFixFlag = process.argv[3]

/**
 * 不同 lint 工具的任务配置
 */
const taskMap: Record<LintTool, { bin: string; targets: string[]; extraArgs?: string[] }> = {
  eslint: {
    bin: 'eslint',
    targets: rootLintTargets.eslint,
  },
  stylelint: {
    bin: 'stylelint',
    targets: rootLintTargets.stylelint,
    extraArgs: ['--allow-empty-input'],
  },
}

/**
 * 获取对应 lint 工具的任务配置
 */
const task = tool ? taskMap[tool] : undefined

/**
 * 检查 lint 工具参数是否有效
 */
if (!task) {
  console.error('Usage: esno ./tooling/scripts/run-root-lint.ts <eslint|stylelint> [--fix]')
  process.exit(1)
}

/**
 * 构建 lint 命令参数
 */
const args = ['exec', task.bin, ...task.targets]

if (maybeFixFlag === '--fix') {
  args.push('--fix')
}

/**
 * 根目录 lint 不应该重新扫描已经有专门包级任务的包源代码
 */
for (const pattern of rootLintIgnorePatterns) {
  args.push('--ignore-pattern', pattern)
}

if (task.extraArgs) {
  args.push(...task.extraArgs)
}

/**
 * 执行 lint 命令
 */
const result = spawnSync('pnpm', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
