module.exports = {
  extends: ["@debbl/eslint-config-react", "plugin:tailwindcss/recommended"],
  plugins: ["tailwindcss"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
