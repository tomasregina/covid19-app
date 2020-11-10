module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-unused-components': 'off',
    'no-multiple-empty-lines': 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'semi': 'off',
    'arrow-spacing': 'off',
    'padded-blocks': 'off',
    'no-trailing-spaces': 'off',
    'no-unused-vars': 'off',
    'space-in-parens': 'off',
    'indent': 'off',
    'array-bracket-spacing': 'warn',
    'object-curly-spacing': 'off',
    'no-multi-spaces': 'off',
    'no-new': 'off',
    'prefer-const': 'off',
    'comma-spacing': 'off',
    'quote-props': 'off',
    'space-infix-ops': 'off',
    'no-tabs': 'off',
    'key-spacing': 'off',
    'quotes': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'object-curly-newline': 'off',
    'array-bracket-spacing': 'off',
    'yoda': 'off',
    'brace-style': 'off'


  }
}
