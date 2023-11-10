const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  parserOptions: {
    project
  },
  env: {
    node: true,
    es6: true
  },
  settings: {
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  overrides: [
    {
      files: ['**/__tests__/**/*'],
      env: {
        jest: true
      }
    }
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'import/no-default-export': 'off'
  }
};
