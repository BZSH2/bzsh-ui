/**
 * 工作空间中需要忽略的文件和目录
 */
export const workspaceIgnores = [
  '**/dist/**',
  '**/coverage/**',
  '**/node_modules/**',
  'apps/docs/.vitepress/cache/**',
  'apps/docs/.vitepress/dist/**',
]

/**
 * 需要被 ESLint 检查的 JavaScript 文件匹配模式
 */
export const eslintJavaScriptFiles = ['**/*.{js,cjs,mjs}']
/**
 * 需要被 ESLint 检查的 TypeScript 文件匹配模式
 */
export const eslintTypeScriptFiles = ['**/*.{ts,mts,cts}']
/**
 * 需要被 ESLint 检查的 Vue 文件匹配模式
 */
export const eslintVueFiles = ['**/*.vue']
/**
 * 需要被 Stylelint 检查的类 HTML 文件
 */
export const stylelintVueLikeFiles = ['.vue', '.htm', '.html']
/**
 * 需要被 Stylelint 检查的 SCSS 文件匹配模式
 */
export const stylelintScssFiles = ['**/*.scss']
/**
 * 根目录的 lint 目标配置
 */
export const rootLintTargets = {
  eslint: ['.'],
  stylelint: ['**/*.{vue,scss,css}'],
}
/**
 * 根目录 lint 时需要忽略的模式
 */
export const rootLintIgnorePatterns = ['packages/**', 'apps/**/dist/**']

/**
 * 需要 lint 的文件扩展名分类
 */
const stagedLintExtensions = {
  script: ['.js', '.cjs', '.mjs', '.ts', '.mts', '.cts', '.vue'],
  style: ['.css', '.scss', '.vue'],
  format: ['.json', '.md', '.yml', '.yaml'],
}

/**
 * 将 Windows 路径中的反斜杠转换为正斜杠，统一路径格式
 * @param filePath 文件路径
 * @returns 标准化后的路径
 */
const normalizePath = (filePath: string) => filePath.replaceAll('\\', '/')

/**
 * 检查文件路径是否应该被忽略（如构建输出、依赖目录等）
 * @param filePath 文件路径
 * @returns 如果路径应该被忽略则返回 true
 */
const isWorkspaceIgnoredPath = (filePath: string) => {
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

/**
 * 引用文件路径，处理特殊字符
 * @param filePath 文件路径
 * @returns 转义后的带引号的文件路径
 */
const quoteFile = (filePath: string) => `"${filePath.replace(/(["`$])/g, '\\$1')}"`

/**
 * 过滤暂存区文件，排除被忽略的路径并只保留指定扩展名的文件
 * @param files 暂存区文件列表
 * @param extensions 需要保留的文件扩展名
 * @returns 过滤后的文件列表
 */
const filterStagedFiles = (files: string[], extensions: string[]) =>
  files.filter((file) => {
    const normalized = normalizePath(file)
    return !isWorkspaceIgnoredPath(normalized) && extensions.some((ext) => normalized.endsWith(ext))
  })

/**
 * 创建执行 lint 命令的工厂函数
 * @param bin 命令可执行文件名称
 * @param baseArgs 基础参数
 * @returns 接受文件列表并生成命令的函数
 */
const createStagedCommand =
  (bin: string, baseArgs: string[] = []) =>
  (files: string[]) => {
    if (!files.length) {
      return []
    }

    return `${bin} ${[...baseArgs, ...files.map(quoteFile)].join(' ')}`
  }

/**
 * lint-staged 配置对象，定义对不同类型文件的处理
 */
export const lintStagedPatterns = {
  '*.{js,cjs,mjs,ts,mts,cts,vue}': (files: string[]) => {
    const matched = filterStagedFiles(files, stagedLintExtensions.script)
    return [
      createStagedCommand('eslint', ['--fix'])(matched),
      createStagedCommand('prettier', ['--write'])(matched),
    ].flat()
  },
  '*.{css,scss,vue}': (files: string[]) => {
    const matched = filterStagedFiles(files, stagedLintExtensions.style)
    return [
      createStagedCommand('stylelint', ['--fix', '--allow-empty-input'])(matched),
      createStagedCommand('prettier', ['--write'])(matched),
    ].flat()
  },
  '*.{json,md,yml,yaml}': (files: string[]) => {
    const matched = filterStagedFiles(files, stagedLintExtensions.format)
    return createStagedCommand('prettier', ['--write'])(matched)
  },
}
