module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recess-order',
    'stylelint-config-html'
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ],
  ignoreFiles: ['dist/**', 'coverage/**', 'node_modules/**'],
  rules: {
    'selector-class-pattern':
      '^(bz|is|has)(-[a-z0-9]+)*$|^[a-z0-9-]+(__[a-z0-9-]+)?(--[a-z0-9-]+)?$',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'scss/dollar-variable-pattern': '^bz-[a-z0-9-]+$'
  }
}
