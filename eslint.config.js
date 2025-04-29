import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                allowDefaultProject: true,
            },
        },
        rules: {
            // Example custom rules
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_",
                },
            ],
            "semi": ["warn", "always"],
            "quotes": ["warn", "double"],
            "indent": ["warn", 4],
            "comma-dangle": ["warn", "always-multiline"],
            "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0 }],
            "space-before-function-paren": ["warn", {
                "anonymous": "never",
                "named": "never",
                "asyncArrow": "always",
            }],
            "object-curly-spacing": ["warn", "always"],
            "array-bracket-spacing": ["warn", "never"],
            "no-trailing-spaces": "warn",
            "eol-last": ["warn", "always"],
            "curly": ["error", "all"],
            "eqeqeq": ["error", "always"],
            "arrow-spacing": ["warn", { before: true, after: true }],
            "arrow-parens": ["warn", "as-needed"],
            "template-curly-spacing": ["warn", "never"],
            "no-useless-call": "warn",
            "no-duplicate-imports": "warn",
        },
    },
);
