module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    // Allow any types for now since this is a legacy codebase
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
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
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.js',
  ],
}; 