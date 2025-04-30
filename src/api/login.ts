import { Express, Request, Response } from "express";
import { Db } from "mongodb";

import * as hash from "../utils/hash.js";
import { isUsersSchema, isUsername, isEmail, isPassword, Username, Email, Password } from "../schema.js";

interface LoginData {
    usernameEmail: Username | Email;
    password: Password;
}

function isLoginData(data: unknown): data is LoginData {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.usernameEmail === "string" && typeof obj.password === "string"
        && (isUsername(obj.usernameEmail) || isEmail(obj.usernameEmail)) && isPassword(obj.password);
}

export default (app: Express, database: Db) => {
    app.post("/api/login", async (req: Request, res: Response) => {
        if (isLoginData(req.body)) {
            const { usernameEmail, password } = req.body;
            if(isEmail(usernameEmail)) {
                const user = await database
                    .collection("users")
                    .findOne({
                        email: usernameEmail,
                    });
                if(isUsersSchema(user)) {
                    if(await hash.compare(password, user.passwordHash)) {
                        req.session.loggedInUserId = user._id.toHexString();
                        res.send();
                    }
                    return;
                }
            }
            const user = await database
                .collection("users")
                .findOne({
                    username: usernameEmail,
                });
            if(isUsersSchema(user)) {
                if(await hash.compare(password, user.passwordHash)) {
                    req.session.loggedInUserId = user._id.toHexString();
                    res.send();
                    return;
                }
            }
            res.status(500).send("Internal server error.");
            console.error(`Error: Couldn't find user with name/email "${usernameEmail}".`);
            return;
        } else {
            res.status(400).send("Invalid data.");
            return;
        }
    });
};
