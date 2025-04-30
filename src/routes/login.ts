import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

import { isUsersSchema } from "../schema.js";

export default (app: Express, database: Db) => {
    app.get("/login", async (req: Request, res: Response) => {
        let username = "";
        if (req.session.loggedInUserId !== undefined) {
            const user = await database.collection("users").findOne({ _id: new ObjectId(req.session.loggedInUserId) });
            if (!isUsersSchema(user)) {
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
};
