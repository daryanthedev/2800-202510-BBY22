import { WithId, Document } from "mongodb";
import Joi from "joi";

type Username = string;
type Email = string;
type Password = string;
const usernameSchema = Joi.string().alphanum().min(3).max(30).required();
const emailSchema = Joi.string().email().max(50).required();
const passwordSchema = Joi.string().min(8).max(50).required();

interface UsersSchema extends WithId<Document> {
    username: Username;
    email: Email;
    passwordHash: string;
}

function isUsername(data: string): data is Username {
    const validationResult = usernameSchema.validate(data);
    if (validationResult.error !== undefined) {
        return false;
    }
    return true;
}

function isEmail(data: string): data is Email {
    const validationResult = emailSchema.validate(data);
    if (validationResult.error !== undefined) {
        return false;
    }
    return true;
}

function isPassword(data: string): data is Password {
    const validationResult = passwordSchema.validate(data);
    if (validationResult.error !== undefined) {
        return false;
    }
    return true;
}

function isUsersSchema(data: WithId<Document> | null): data is UsersSchema {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return (
        typeof obj.username === "string" &&
        typeof obj.email === "string" &&
        typeof obj.passwordHash === "string" &&
        isUsername(obj.username) &&
        isEmail(obj.email)
    );
}

export type { Username, Email, Password, UsersSchema };

export { isUsername, isEmail, isPassword, isUsersSchema };
