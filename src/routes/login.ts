import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

import * as hash from "../utils/hash";
import { isUsersSchema } from "../schema";

// The login API endpoint takes either a UsernameLogin or EmailLogin
interface UsernameLogin {
    username: string;
    password: string;
}

interface EmailLogin {
    email: string;
    password: string;
}

function isUsernameLogin(data: unknown): data is UsernameLogin {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.username === "string" && typeof obj.password === "string";
}

function isEmailLogin(data: unknown): data is EmailLogin {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.email === "string" && typeof obj.password === "string";
}

export default (app: Express, database: Db) => {
    app.get("/login", async (req: Request, res: Response) => {
        let username = "";
        if(req.session.loggedInUserId !== undefined) {
            const user = await database.collection("users").findOne({ _id: new ObjectId(req.session.loggedInUserId) });
            if(!isUsersSchema(user)) {
                res.status(500).send();
                console.error(`Error: Couldn't find user with id "${req.session.loggedInUserId}".`);
                return;
            }
            username = user.username;
        } else {
            username = "None";
        }
        res.render("login.ejs", { currentUser: username });
    });

    app.post("/login", async (req: Request, res: Response) => {
        if (isUsernameLogin(req.body)) {
            const { username, password } = req.body;
            const user = await database
                .collection("users")
                .findOne({
                    username,
                });
            if(!isUsersSchema(user)) {
                res.status(500).send();
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
                res.status(500).send();
                console.error(`Error: Couldn't find user with email "${email}".`);
                return;
            }
            if(await hash.compare(password, user.passwordHash)) {
                req.session.loggedInUserId = user._id.toHexString();
                res.send();
            }
        } else {
            res.status(400).send();
            return;
        }
    });
};
