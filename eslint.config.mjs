import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'docs/.vitepress/dist/**'
    ]
  },
  {
    files: ['**/*.{cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      'unused-imports': unusedImports
    },
    rules: {
      'no-undef': 'off',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
            ['type']
          ]
        }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    },
    settings: {
      'import/resolver': {
        typescript: true
      }
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      'unused-imports': unusedImports
    },
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
            ['type']
          ]
        }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    },
    settings: {
      'import/resolver': {
        typescript: true
      }
    }
  },
  eslintConfigPrettier
]
