import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = path.dirname(fileURLToPath(import.meta.url))

export const repoRoot = path.resolve(configDir, '..', '..')
export const appsDir = path.join(repoRoot, 'apps')
export const packagesDir = path.join(repoRoot, 'packages')
export const toolingDir = path.join(repoRoot, 'tooling')

export const docsDir = path.join(appsDir, 'docs')
export const playDir = path.join(appsDir, 'play')

export const componentsDir = path.join(packagesDir, 'components')
export const uiPackageDir = path.join(packagesDir, 'ui')
export const themeChalkSrcDir = path.join(packagesDir, 'theme-chalk', 'src')
export const scriptsDir = path.join(toolingDir, 'scripts')

export const componentEntriesPath = path.join(componentsDir, 'index.ts')
export const defaultComponentsPath = path.join(uiPackageDir, 'defaults.ts')
export const themeIndexPath = path.join(themeChalkSrcDir, 'index.scss')
export const themeBasePath = path.join(themeChalkSrcDir, 'base.scss')

export const packageAliases: Record<string, string> = {
  '@': packagesDir,
  '@bzsh-ui/components': path.join(componentsDir, 'index.ts'),
  '@bzsh-ui/core': path.join(uiPackageDir, 'index.ts'),
  '@bzsh-ui/internal': path.join(packagesDir, 'internal', 'index.ts'),
  '@bzsh-ui/utils': path.join(packagesDir, 'utils', 'index.ts'),
}
