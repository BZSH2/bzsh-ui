import { spawnSync } from 'node:child_process'

import { rootTaskGroups } from '../config/root-tasks.ts'

const groupName = process.argv[2]
const scriptNames = groupName ? rootTaskGroups[groupName] : undefined

if (!scriptNames) {
  console.error(`Unknown root task group: ${groupName ?? '(missing)'}`)
  console.error(`Available groups: ${Object.keys(rootTaskGroups).join(', ')}`)
  process.exit(1)
}

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
