export const rootTaskGroups: Record<string, string[]> = {
  'build': ['build:packages', 'build:docs'],
  'build:lib': ['build:packages'],
  'check': ['lint', 'typecheck', 'test', 'build'],
  'lint': ['lint:packages', 'lint:root'],
  'lint:fix': ['lint:eslint:fix', 'lint:stylelint:fix'],
  'lint:root': ['lint:eslint', 'lint:stylelint'],
  'release:verify': ['check', 'format:check'],
  'test': ['test:packages'],
  'typecheck': ['typecheck:packages', 'typecheck:root'],
}
