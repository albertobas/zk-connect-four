module.exports = {
  extends: ['custom/next'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'import/no-cycle': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/no-array-index-key': 'off'
  }
};
