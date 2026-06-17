export const workspacePackageGlob = './packages/*'

export const workspacePackageTestFilters = ['@bzsh-ui/components', '@bzsh-ui/utils']

export const workspaceAppFilters = {
  docs: '@bzsh-ui/docs',
  play: '@bzsh-ui/play',
} as const

export const workspaceTasks: Record<string, string[]> = {
  'docs:build': ['--filter', workspaceAppFilters.docs, 'run', 'build'],
  'docs:dev': ['--filter', workspaceAppFilters.docs, 'run', 'dev'],
  'docs:preview': ['--filter', workspaceAppFilters.docs, 'run', 'preview'],
  'packages:build': ['-r', '--filter', workspacePackageGlob, '--if-present', 'run', 'build'],
  'packages:lint': ['-r', '--filter', workspacePackageGlob, '--if-present', 'run', 'lint'],
  'packages:typecheck': [
    '-r',
    '--filter',
    workspacePackageGlob,
    '--if-present',
    'run',
    'typecheck',
  ],
  'packages:test': [
    '-r',
    ...workspacePackageTestFilters.flatMap((filter) => ['--filter', filter]),
    '--if-present',
    'run',
    'test',
  ],
  'play:build': ['--filter', workspaceAppFilters.play, 'run', 'build'],
  'play:dev': ['--filter', workspaceAppFilters.play, 'run', 'dev'],
  'play:preview': ['--filter', workspaceAppFilters.play, 'run', 'preview'],
}
