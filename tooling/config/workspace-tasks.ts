/**
 * 工作区包的 glob 匹配模式
 */
export const workspacePackageGlob = './packages/*'

/**
 * 需要运行测试的工作区包筛选器
 */
export const workspacePackageTestFilters = ['@bzsh-ui/components', '@bzsh-ui/utils']

/**
 * 工作区应用筛选器
 */
export const workspaceAppFilters = {
  docs: '@bzsh-ui/docs',
  play: '@bzsh-ui/play',
} as const

/**
 * 工作区任务配置
 * 定义了在 pnpm workspace 中执行的各种任务
 */
export const workspaceTasks: Record<string, string[]> = {
  /**
   * 构建文档应用
   */
  'docs:build': ['--filter', workspaceAppFilters.docs, 'run', 'build'],
  /**
   * 启动文档开发服务器
   */
  'docs:dev': ['--filter', workspaceAppFilters.docs, 'run', 'dev'],
  /**
   * 预览文档应用构建结果
   */
  'docs:preview': ['--filter', workspaceAppFilters.docs, 'run', 'preview'],
  /**
   * 构建所有工作区包
   */
  'packages:build': ['-r', '--filter', workspacePackageGlob, '--if-present', 'run', 'build'],
  /**
   * 对所有工作区包运行 lint
   */
  'packages:lint': ['-r', '--filter', workspacePackageGlob, '--if-present', 'run', 'lint'],
  /**
   * 对所有工作区包运行类型检查
   */
  'packages:typecheck': [
    '-r',
    '--filter',
    workspacePackageGlob,
    '--if-present',
    'run',
    'typecheck',
  ],
  /**
   * 对指定的工作区包运行测试
   */
  'packages:test': [
    '-r',
    ...workspacePackageTestFilters.flatMap((filter) => ['--filter', filter]),
    '--if-present',
    'run',
    'test',
  ],
  /**
   * 构建演示应用
   */
  'play:build': ['--filter', workspaceAppFilters.play, 'run', 'build'],
  /**
   * 启动演示开发服务器
   */
  'play:dev': ['--filter', workspaceAppFilters.play, 'run', 'dev'],
  /**
   * 预览演示应用构建结果
   */
  'play:preview': ['--filter', workspaceAppFilters.play, 'run', 'preview'],
}
