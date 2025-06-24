module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Allow console for development
    'no-console': 'warn',
    // Prefer const
    'prefer-const': 'error',
    // No var
    'no-var': 'error',
    // Semicolons
    'semi': ['error', 'always'],
    // Quotes
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    // No unused vars
    'no-unused-vars': 'off', // Disable for TypeScript files
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    'src/__tests__/__mocks__/', // Skip mock files
  ],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-undef': 'off', // TypeScript handles this
      },
    },
  ],
}; 