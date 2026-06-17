export default {
  '*.{js,cjs,mjs,ts,mts,cts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,vue}': ['stylelint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
}
