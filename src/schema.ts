import Joi from "joi";

// Type for a string that follows the username schema.
type Username = string;
// Type for a string that follows the email schema.
type Email = string;
// Type for a string that follows the password schema.
type Password = string;

const usernameSchema = Joi.string().alphanum().min(3).max(30).required();
const emailSchema = Joi.string().email().max(50).required();
const passwordSchema = Joi.string().min(8).max(50).required();

// Schema for a user document in the database.
interface UsersSchema {
    username: Username;
    email: Email;
    passwordHash: string;
    lastStreakDate: Date | null;
}

/**
 * Checks if a string is a valid Username.
 * @param {string} data
 * @returns {data is Username}
 */
function isUsername(data: string): data is Username {
    const validationResult = usernameSchema.validate(data);
    if (validationResult.error !== undefined) {
        return false;
    }
    return true;
}

/**
 * Checks if a string is a valid Email.
 * @param {string} data
 * @returns {data is Email}
 */
function isEmail(data: string): data is Email {
    const validationResult = emailSchema.validate(data);
    if (validationResult.error !== undefined) {
        return false;
    }
    return true;
}

/**
 * Checks if a string is a valid Password.
 * @param {string} data
 * @returns {data is Password}
 */
function isPassword(data: string): data is Password {
    const validationResult = passwordSchema.validate(data);
    if (validationResult.error !== undefined) {
        return false;
    }
    return true;
}

/**
 * Type guard to check if an object matches the UsersSchema interface.
 * @param {unknown} data
 * @returns {data is UsersSchema}
 */
function isUsersSchema(data: unknown): data is UsersSchema {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return (
        typeof obj.username === "string" &&
        typeof obj.email === "string" &&
        typeof obj.passwordHash === "string" &&
        typeof obj.lastStreakDate === "object" &&
        (obj.lastStreakDate instanceof Date || obj.lastStreakDate === null) &&
        isUsername(obj.username) &&
        isEmail(obj.email)
    );
}

export type { Username, Email, Password, UsersSchema };

export { isUsername, isEmail, isPassword, isUsersSchema };
