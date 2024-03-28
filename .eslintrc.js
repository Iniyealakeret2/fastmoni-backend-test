module.exports = {
  root: true,
  env: { node: true, es6: true },
  parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
  ignorePatterns: ["node_modules/*", "!.prettierrc.js"], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ["eslint:recommended"],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ["**/*.ts"],
      env: { node: true, es6: true },
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
      ],
    },
  ],
};
