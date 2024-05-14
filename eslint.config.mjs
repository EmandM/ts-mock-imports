import js from "@eslint/js";
import tseslint from "typescript-eslint";
import tsparser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        sourceType: "module",
        tsconfigRootDir: './',
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "max-line-length": "off",
      "no-parameter-reassignment": "off",
      "one-variable-per-declaration": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",

    },
  }, {
    ignores: ["**/*.dtslint.ts", "**/*.d.ts", "lib/*", "eslint.config.mjs"],
  }, {
    files:["test/**/*"],
    rules: {
        "no-console": "off",
        "@typescript-eslint/unbound-method": "off",
    }
  },
];
