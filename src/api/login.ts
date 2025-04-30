import { Express, Request, Response } from "express";
import { Db } from "mongodb";

import * as hash from "../utils/hash";
import { isUsersSchema, isUsername, isEmail, isPassword, Username, Email, Password } from "../schema";

// The login API endpoint takes either a UsernameLogin or EmailLogin
interface UsernameLogin {
    username: Username;
    password: Password;
}

interface EmailLogin {
    email: Email;
    password: Password;
}

function isUsernameLogin(data: unknown): data is UsernameLogin {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.username === "string" && typeof obj.password === "string"
        && isUsername(obj.username) && isPassword(obj.password);
}

function isEmailLogin(data: unknown): data is EmailLogin {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.email === "string" && typeof obj.password === "string"
        && isEmail(obj.email) && isPassword(obj.password);
}

export default (app: Express, database: Db) => {
    app.post("/api/login", async (req: Request, res: Response) => {
        if (isUsernameLogin(req.body)) {
            const { username, password } = req.body;
            const user = await database
                .collection("users")
                .findOne({
                    username,
                });
            if(!isUsersSchema(user)) {
                res.status(500).send("Internal server error.");
                console.error(`Error: Couldn't find user with name "${username}".`);
                return;
            }
            if(await hash.compare(password, user.passwordHash)) {
                req.session.loggedInUserId = user._id.toHexString();
                res.send();
            }
        } else if (isEmailLogin(req.body)) {
            const { email, password } = req.body;
            const user = await database
                .collection("users")
                .findOne({
                    email,
                });
            if(!isUsersSchema(user)) {
                res.status(500).send("Internal server error.");
                console.error(`Error: Couldn't find user with email "${email}".`);
                return;
            }
            if(await hash.compare(password, user.passwordHash)) {
                req.session.loggedInUserId = user._id.toHexString();
                res.send();
            }
        } else {
            res.status(400).send("Invalid data.");
            return;
        }
    });
};
