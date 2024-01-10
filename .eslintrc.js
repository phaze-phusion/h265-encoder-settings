module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
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
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended', // this is shorthand for 'plugin:import/errors' and 'plugin:import/warnings'
    'plugin:import/typescript',
    'plugin:eslint-comments/recommended',
    "plugin:@typescript-eslint/recommended"
  ],
  env: {
    es6: true,
    browser: true,
    commonjs: true,
    node: false
  },
  ignorePatterns: [
    'dist/',
    'node_modules/'
  ],

  // 0 or "off" or 0 - turn the rule off
  // 1 or "warn" - turn the rule on as a warning (doesn't affect exit code)
  // 2 or "error" - turn the rule on as an error (exit code is 1 when triggered)
  rules: {
    // https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/
    'eslint-comments/no-duplicate-disable': 2,
    'eslint-comments/no-unlimited-disable': 2,

    // https://www.npmjs.com/package/eslint-plugin-import
    'import/no-unresolved': [2, {commonjs: true}],
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-namespace': 2,
    'import/no-mutable-exports': 1,
    'import/no-absolute-path': 2,
    'import/no-dynamic-require': 0,
    'import/no-unused-modules': 2
  },
};
