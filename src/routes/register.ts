import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import * as hash from "../utils/hash";

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

function isRegisterData(data: unknown): data is RegisterData {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.username === "string" && typeof obj.email === "string" && typeof obj.password === "string";
}

export default (app: Express, database: Db) => {
    app.get("/register", (_: Request, res: Response) => {
        res.render("register.ejs");
    });

    app.post("/register", async (req: Request, res: Response) => {
        if (isRegisterData(req.body)) {
            const { username, email, password } = req.body;
            const passwordHash = await hash.hash(password);
            database
                .collection("users")
                .insertOne({
                    username,
                    email,
                    passwordHash,
                })
                .then(() => {
                    res.send();
                })
                .catch((err: unknown) => {
                    console.error("Error inserting user into database:", err);
                    res.status(500).send();
                });
        } else {
            res.status(400).send();
        }
    });
};
