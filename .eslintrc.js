module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
    },
    rules: {
        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': ['error', 'never'],
        'no-unused-vars': ['warn'],
        'no-var': ['error'],
        'one-var': ['error'],
        'no-console': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
    },
}
