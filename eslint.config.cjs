/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        experimentalDecorators: true,
      },
    },

    extends: compat.extends('plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'),

    rules: {
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-declaration-merging': 0,
    },
  },
]);
