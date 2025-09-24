import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
    ignores: ['dist/**'],
  },
  tseslint.configs.recommended,
])
