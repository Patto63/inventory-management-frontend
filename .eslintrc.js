/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'react/react-in-jsx-scope': 'off', // no se necesita en Next.js 12+
    'react/prop-types': 'off', // si usas TypeScript
  },
};