module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ["@babel/preset-env"],
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      impliedStrict: true,
    },
  },
  plugins: [
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended', // this is shorthand for 'plugin:import/errors' and 'plugin:import/warnings'
    'plugin:eslint-comments/recommended',
  ],
  env: {
    es6: true,
    browser: true,
    commonjs: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/'
  ],

  rules: {
    // https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',

    // https://www.npmjs.com/package/eslint-plugin-import
    'import/no-unresolved': ['error', {commonjs: true}],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/no-namespace': 'error',
    'import/no-mutable-exports': 'warn',
    'import/no-absolute-path': 'error',
    'import/no-dynamic-require': 'off',
    'import/no-unused-modules': 'error',
  },
};
