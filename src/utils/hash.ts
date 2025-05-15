import bcrypt from "bcrypt";

/*
 * The number of salt rounds to use for bcrypt hashing.
 * Defaults to 12 if not specified in the environment.
 */
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

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} The hashed password.
 */
function hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password to a hashed password.
 * @param {string} plaintext - The plaintext password.
 * @param {string} hashed - The hashed password.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
function compare(plaintext: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hashed);
}

export { hash, compare };
