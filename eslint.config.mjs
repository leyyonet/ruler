import eslint from '@eslint/js';
import ts_eslint from 'typescript-eslint';

export default ts_eslint.config(
    eslint.configs.recommended,
    ts_eslint.configs.strict,
    ts_eslint.configs.stylistic,
    {
        rules: {
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/no-extraneous-class": "off",
        }
    }
);
