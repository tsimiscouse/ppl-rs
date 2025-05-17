export default {
  env: {
    jest: true,  // Make sure jest is enabled in env
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended', // Use this for Jest rules
  ],
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,  // Needed for babel-eslint parser
  },
  rules: {
    "no-undef": "off",  // Turn off no-undef to allow Jest globals
  },
  overrides: [
    {
      files: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"],
      rules: {
        "no-undef": "off",  // Disable "no-undef" in test files where Jest globals are used
      }
    }
  ],
  plugins: ['react', 'jest'],  // Ensure jest plugin is included
  parser: "@babel/eslint-parser",  // Babel parser needed for JSX syntax
};
