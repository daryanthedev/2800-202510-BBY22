import bcrypt from "bcrypt";

const SALT_ROUNDS = (() => {
    if (process.env.SALT_ROUNDS === undefined) {
        return 12; // default to 12 rounds
    }
    const PARSED_SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
    if (isNaN(PARSED_SALT_ROUNDS)) {
        throw new Error("SALT_ROUNDS environment variable is not a number.");
    }
    if (PARSED_SALT_ROUNDS <= 0) {
        throw new Error("SALT_ROUNDS environment variable is not a positive number.");
    }
    return PARSED_SALT_ROUNDS;
})();

export default (password: string) => bcrypt.hash(password, SALT_ROUNDS);
