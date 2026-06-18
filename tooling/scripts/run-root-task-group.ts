import { spawnSync } from 'node:child_process'

import { rootTaskGroups } from '../config/root-tasks'

/**
 * 要执行的任务组名称
 */
const groupName = process.argv[2]
/**
 * 任务组中包含的脚本名称列表
 */
const scriptNames = groupName ? rootTaskGroups[groupName] : undefined

/**
 * 检查任务组是否有效
 */
if (!scriptNames) {
  console.error(`Unknown root task group: ${groupName ?? '(missing)'}`)
  console.error(`Available groups: ${Object.keys(rootTaskGroups).join(', ')}`)
  process.exit(1)
}

/**
 * 顺序执行任务组中的每个脚本
 */
for (const scriptName of scriptNames) {
  const result = spawnSync('pnpm', ['run', scriptName], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
