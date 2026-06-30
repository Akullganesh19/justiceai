import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist', 'node_modules', 'build', 'public', 'coverage'],
  },
  // Config files with __dirname
  {
    files: ['vite.config.js', 'vitest.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // Test files with vitest globals
  {
    files: ['src/test/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest,
        ...globals.node,
        global: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
    },
  },
  // Main source files
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: '18.2' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'react-refresh/only-export-components': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      // Disable strict React 19 rules that are too opinionated
      'react-hooks/state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'no-empty': 'warn',
    },
  },
  // Server files
  {
    files: ['server.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
];
