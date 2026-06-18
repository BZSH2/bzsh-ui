import { spawnSync } from 'node:child_process'

import { workspaceTasks } from '../config/workspace-tasks'

/**
 * 要执行的工作区任务名称
 */
const taskName = process.argv[2]
/**
 * 需要透传给任务的额外参数
 */
const passthroughArgs = process.argv.slice(3)
/**
 * 任务对应的 pnpm 参数列表
 */
const taskArgs = taskName ? workspaceTasks[taskName] : undefined

/**
 * 检查工作区任务是否有效
 */
if (!taskArgs) {
  console.error(`Unknown workspace task: ${taskName ?? '(missing)'}`)
  console.error(`Available tasks: ${Object.keys(workspaceTasks).join(', ')}`)
  process.exit(1)
}

/**
 * 执行工作区任务
 */
const result = spawnSync('pnpm', [...taskArgs, ...passthroughArgs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
