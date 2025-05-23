/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off', // No es necesario en Next.js 12+
    'react/prop-types': 'off',         // Innecesario si usas TypeScript
    '@typescript-eslint/no-empty-interface': 'off', // Para permitir interfaces vacías
  },
  settings: {
    react: {
      version: 'detect', // Detectar automáticamente la versión de React
    },
  },
};
