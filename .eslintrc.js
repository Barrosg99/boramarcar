module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [],
  parserOptions: { ecmaVersion: "latest" },
  rules: {
    "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
    "import/extensions": ["off", "always"],
    "no-restricted-syntax": ["off", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"],
    "func-names": ["off", "as-needed"],
    quotes: ["error", "double"],
    "object-curly-newline": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "no-console": ["error", { allow: ["error"] }],
    "no-shadow": ["off"],
    "no-restricted-globals": "off",
  },
};