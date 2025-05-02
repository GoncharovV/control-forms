import { eslintConfig, eslintConfigReact } from '@goncharovv/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...eslintConfig,
  ...eslintConfigReact,

  {
    ignores: ['docs/**'],
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/max-len': ['error', 140],
    },
  },
];
