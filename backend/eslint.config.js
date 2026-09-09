import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, import: importPlugin },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },
  tseslint.configs.recommended,
])
