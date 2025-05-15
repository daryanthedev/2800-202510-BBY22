import { Express, Request, Response } from "express";
import { Db } from "mongodb";

import * as hash from "../utils/hash.js";
import { isUsername, isEmail, isPassword, Username, Email, Password, UsersSchema } from "../schema.js";

interface RegisterData {
    username: Username;
    email: Email;
    password: Password;
}

function isRegisterData(data: unknown): data is RegisterData {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return (
        typeof obj.username === "string" &&
        typeof obj.email === "string" &&
        typeof obj.password === "string" &&
        isUsername(obj.username) &&
        isEmail(obj.email) &&
        isPassword(obj.password)
    );
}

export default (app: Express, database: Db) => {
    async function emailNotUsed(email: Email) {
        const user = await database.collection("users").findOne({ email });
        return user === null;
    }

    app.post("/api/register", async (req: Request, res: Response) => {
        if (isRegisterData(req.body)) {
            const { username, email, password } = req.body;
            if (await emailNotUsed(email)) {
                const passwordHash = await hash.hash(password);
                database
                    .collection("users")
                    .insertOne({
                        username,
                        email,
                        passwordHash,
                        lastStreakDate: null,
                        monsterHealth: 100,
                        points: 0,
                        monsterHealthModifier: 0,
                        inventory: [],
                    } satisfies UsersSchema)
                    .then(() => {
                        res.send();
                    })
                    .catch((err: unknown) => {
                        console.error("Error inserting user into database:", err);
                        res.status(500).send("Internal server error.");
                    });
            } else {
                res.status(400).send("Email already in use.");
            }
        } else {
            res.status(400).send("Invalid data.");
        }
    });
};
