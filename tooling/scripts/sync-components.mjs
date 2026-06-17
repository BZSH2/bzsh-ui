import { syncComponentRegistry } from './component-registry.mjs'

const dryRun = process.argv.includes('--dry-run')

syncComponentRegistry({ dryRun }).catch((error) => {
  console.error(error.message)
  process.exit(1)
})
