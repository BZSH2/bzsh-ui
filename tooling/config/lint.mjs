export const workspaceIgnores = [
  '**/dist/**',
  '**/coverage/**',
  '**/node_modules/**',
  'apps/docs/.vitepress/cache/**',
  'apps/docs/.vitepress/dist/**',
]

export const eslintJavaScriptFiles = ['**/*.{js,cjs,mjs}']
export const eslintTypeScriptFiles = ['**/*.{ts,mts,cts}']
export const eslintVueFiles = ['**/*.vue']
export const stylelintVueLikeFiles = ['.vue', '.htm', '.html']
export const stylelintScssFiles = ['**/*.scss']
export const rootLintTargets = {
  eslint: ['.'],
  stylelint: ['**/*.{vue,scss,css}'],
}
export const rootLintIgnorePatterns = ['packages/**', 'apps/**/dist/**']

const stagedLintExtensions = {
  script: ['.js', '.cjs', '.mjs', '.ts', '.mts', '.cts', '.vue'],
  style: ['.css', '.scss', '.vue'],
  format: ['.json', '.md', '.yml', '.yaml'],
}

const normalizePath = (filePath) => filePath.replaceAll('\\', '/')

const isWorkspaceIgnoredPath = (filePath) => {
  const normalized = normalizePath(filePath)

  return (
    normalized === 'dist' ||
    normalized.startsWith('dist/') ||
    normalized.includes('/dist/') ||
    normalized === 'coverage' ||
    normalized.startsWith('coverage/') ||
    normalized.includes('/coverage/') ||
    normalized === 'node_modules' ||
    normalized.startsWith('node_modules/') ||
    normalized.includes('/node_modules/') ||
    normalized.startsWith('apps/docs/.vitepress/cache/') ||
    normalized.startsWith('apps/docs/.vitepress/dist/')
  )
}

const quoteFile = (filePath) => `"${filePath.replace(/(["`$])/g, '\\$1')}"`

const filterStagedFiles = (files, extensions) =>
  files.filter((file) => {
    const normalized = normalizePath(file)
    return !isWorkspaceIgnoredPath(normalized) && extensions.some((ext) => normalized.endsWith(ext))
  })

const createStagedCommand =
  (bin, baseArgs = []) =>
  (files) => {
    if (!files.length) {
      return []
    }

    return `${bin} ${[...baseArgs, ...files.map(quoteFile)].join(' ')}`
  }

export const lintStagedPatterns = {
  '*.{js,cjs,mjs,ts,mts,cts,vue}': (files) => {
    const matched = filterStagedFiles(files, stagedLintExtensions.script)
    return [
      createStagedCommand('eslint', ['--fix'])(matched),
      createStagedCommand('prettier', ['--write'])(matched),
    ].flat()
  },
  '*.{css,scss,vue}': (files) => {
    const matched = filterStagedFiles(files, stagedLintExtensions.style)
    return [
      createStagedCommand('stylelint', ['--fix', '--allow-empty-input'])(matched),
      createStagedCommand('prettier', ['--write'])(matched),
    ].flat()
  },
  '*.{json,md,yml,yaml}': (files) => {
    const matched = filterStagedFiles(files, stagedLintExtensions.format)
    return createStagedCommand('prettier', ['--write'])(matched)
  },
}
