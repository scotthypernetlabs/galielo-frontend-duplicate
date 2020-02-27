module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
    'plugin:prettier/recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'prettier',
    'react',
    'sort-imports-es6-autofix',
    '@typescript-eslint',
  ],
  'rules': {
    "camelcase": "off",
    "no-unused-vars": "off",
    "object-curly-spacing": ["error", "always"],
    "prettier/prettier": "error",
    "react/display-name": "off",
    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": false,
        "MethodDefinition": false,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false
      }
    }],
    "sort-imports-es6-autofix/sort-imports-es6": ["error", {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    }],
    "space-before-blocks": ["error", "always"],
  },
};
