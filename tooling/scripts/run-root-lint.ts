import { spawnSync } from 'node:child_process'

// @ts-ignore lint.mjs remains a JS compatibility entry for tool configs.
import { rootLintIgnorePatterns, rootLintTargets } from '../config/lint.mjs'

type LintTool = 'eslint' | 'stylelint'

const tool = process.argv[2] as LintTool | undefined
const maybeFixFlag = process.argv[3]

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

const task = tool ? taskMap[tool] : undefined

if (!task) {
  console.error('Usage: esno ./tooling/scripts/run-root-lint.ts <eslint|stylelint> [--fix]')
  process.exit(1)
}

const args = ['exec', task.bin, ...task.targets]

if (maybeFixFlag === '--fix') {
  args.push('--fix')
}

for (const pattern of rootLintIgnorePatterns) {
  args.push('--ignore-pattern', pattern)
}

if (task.extraArgs) {
  args.push(...task.extraArgs)
}

const result = spawnSync('pnpm', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
