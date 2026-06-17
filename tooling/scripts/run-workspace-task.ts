import { spawnSync } from 'node:child_process'

import { workspaceTasks } from '../config/workspace-tasks.ts'

const taskName = process.argv[2]
const passthroughArgs = process.argv.slice(3)
const taskArgs = taskName ? workspaceTasks[taskName] : undefined

if (!taskArgs) {
  console.error(`Unknown workspace task: ${taskName ?? '(missing)'}`)
  console.error(`Available tasks: ${Object.keys(workspaceTasks).join(', ')}`)
  process.exit(1)
}

const result = spawnSync('pnpm', [...taskArgs, ...passthroughArgs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
