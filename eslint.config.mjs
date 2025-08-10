import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // ✅ fix JSX scope error
      "react/jsx-uses-react": "off",     // legacy rule, safe to disable
      "react/jsx-uses-vars": "warn",     // ensures variables used in JSX are marked as used
    },
    settings: {
      react: {
        version: "detect", // ✅ fixes React version warning
      },
    },
  },
  tseslint.configs.recommended,
]);