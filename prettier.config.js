/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    printWidth: 140,
    arrowParens: 'avoid',
    endOfLine: 'auto',
    overrides: [
        {
            files: ['*.js', '*.ts'],
            options: {
                tabWidth: 4,
            }
        }
    ]
};
  
export default config;