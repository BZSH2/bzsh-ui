import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

import {
  eslintJavaScriptFiles,
  eslintTypeScriptFiles,
  eslintVueFiles,
  workspaceIgnores,
} from './tooling/config/lint.ts'

const sharedImportRules = {
  'import/order': [
    'error',
    {
      'alphabetize': { order: 'asc', caseInsensitive: true },
      'newlines-between': 'always',
      'groups': [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index'], ['type']],
    },
  ],
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  '@typescript-eslint/no-unused-vars': 'off',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    },
  ],
}

export default [
  {
    ignores: workspaceIgnores,
  },
  {
    files: eslintJavaScriptFiles,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: eslintTypeScriptFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-undef': 'off',
      ...sharedImportRules,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  {
    files: eslintVueFiles,
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
        },
      ],
      'vue/require-default-prop': 'off',
      ...sharedImportRules,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  eslintConfigPrettier,
]
