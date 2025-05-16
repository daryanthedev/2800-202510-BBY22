import { Express, Request, Response } from "express";
import { Db } from "mongodb";

import * as hash from "../../utils/hash.js";
import { isUsersSchema, isUsername, isEmail, isPassword, Username, Email, Password } from "../../schema.js";
import StatusError from "../../utils/statusError.js";

// Data required for login: username/email and password.
interface LoginData {
    usernameEmail: Username | Email;
    password: Password;
}

/**
 * Type guard to check if an object is LoginData.
 * @param {unknown} data
 * @returns {data is LoginData}
 */
function isLoginData(data: unknown): data is LoginData {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return (
        typeof obj.usernameEmail === "string" &&
        typeof obj.password === "string" &&
        (isUsername(obj.usernameEmail) || isEmail(obj.usernameEmail)) &&
        isPassword(obj.password)
    );
}

/**
 * Registers the /api/login endpoint for user authentication.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.post("/api/auth/login", async (req: Request, res: Response) => {
        if (!isLoginData(req.body)) {
            throw new StatusError(400, "Invalid data");
        }
        const { usernameEmail, password } = req.body;
        if (isEmail(usernameEmail)) {
            const user = await database.collection("users").findOne({
                email: usernameEmail,
            });
            if (isUsersSchema(user)) {
                if (await hash.compare(password, user.passwordHash)) {
                    req.session.loggedInUserId = user._id.toHexString();
                    res.send();
                }
                return;
            }
        }
        const user = await database.collection("users").findOne({
            username: usernameEmail,
        });
        if (isUsersSchema(user)) {
            if (await hash.compare(password, user.passwordHash)) {
                req.session.loggedInUserId = user._id.toHexString();
                res.send();
                return;
            }
        }
        throw new StatusError(401, "Incorrect login data");
    });
};
