import { syncComponentRegistry } from './component-registry'

/**
 * 是否只进行模拟运行，不实际修改文件
 */
const dryRun = process.argv.includes('--dry-run')

/**
 * 执行同步组件注册表脚本
 */
syncComponentRegistry({ dryRun }).catch((error) => {
  console.error(error.message)
  process.exit(1)
})
