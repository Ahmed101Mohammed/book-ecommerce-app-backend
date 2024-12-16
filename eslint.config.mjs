import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      'no-undef': 'off',
    },
  },
  // { languageOptions: { globals: globals.browser } },
]
