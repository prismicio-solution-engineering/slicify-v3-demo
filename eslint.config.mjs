import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // === RULES FOR UNUSED CODE ===
      // '@typescript-eslint/no-unused-vars' is the rule that finds unused symbols.
      "@typescript-eslint/no-unused-vars": [
        "warn", // Use 'warn' to report as a warning, 'error' to cause a build failure
        {
          vars: "all", // Check all variables defined
          args: "after-used", // Check arguments only after the last used one
          ignoreRestSiblings: true, // Ignore unused rest parameters (...rest)
        },
      ],
      // Disable the base ESLint 'no-unused-vars' rule as the TypeScript one is more capable
      "no-unused-vars": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
