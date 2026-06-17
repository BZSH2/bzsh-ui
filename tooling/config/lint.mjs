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

export const lintStagedPatterns = {
  '*.{js,cjs,mjs,ts,mts,cts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,vue}': ['stylelint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
}
