import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 当前配置文件所在目录
 */
const configDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * 项目根目录路径
 */
export const repoRoot = path.resolve(configDir, '..', '..')
/**
 * packages 目录路径，包含组件库的核心包
 */
export const packagesDir = path.join(repoRoot, 'packages')
/**
 * tooling 目录路径，包含构建和开发工具
 */
export const toolingDir = path.join(repoRoot, 'tooling')

/**
 * 文档应用目录路径
 */
export const docsDir = path.join(repoRoot, 'docs')
/**
 * 开发演示应用目录路径
 */
export const playDir = path.join(repoRoot, 'play')

/**
 * 组件包目录路径
 */
export const componentsDir = path.join(packagesDir, 'components')
/**
 * 组合模块包目录路径
 */
export const modulesDir = path.join(packagesDir, 'modules')
/**
 * UI 核心包目录路径
 */
export const uiPackageDir = path.join(packagesDir, 'ui')
/**
 * 主题包源代码目录路径
 */
export const themeChalkSrcDir = path.join(packagesDir, 'theme-chalk', 'src')
/**
 * 工具脚本目录路径
 */
export const scriptsDir = path.join(toolingDir, 'scripts')

/**
 * 组件入口文件路径
 */
export const componentEntriesPath = path.join(componentsDir, 'index.ts')
/**
 * 组合模块入口文件路径
 */
export const moduleEntriesPath = path.join(modulesDir, 'index.ts')
/**
 * 默认组件配置文件路径
 */
export const defaultComponentsPath = path.join(uiPackageDir, 'defaults.ts')
/**
 * 主题样式入口文件路径
 */
export const themeIndexPath = path.join(themeChalkSrcDir, 'index.scss')
/**
 * 主题基础样式文件路径
 */
export const themeBasePath = path.join(themeChalkSrcDir, 'base.scss')

/**
 * 包导入别名配置
 */
export const packageAliases: Record<string, string> = {
  '@': packagesDir,
  '@bzsh-ui/components': path.join(componentsDir, 'index.ts'),
  '@bzsh-ui/modules': path.join(modulesDir, 'index.ts'),
  '@bzsh-ui/core': path.join(uiPackageDir, 'index.ts'),
  '@bzsh-ui/internal': path.join(packagesDir, 'internal', 'index.ts'),
  '@bzsh-ui/utils': path.join(packagesDir, 'utils', 'index.ts'),
}
