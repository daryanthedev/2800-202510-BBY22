import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

import { isUsersSchema } from "../schema.js";

export default (app: Express, database: Db) => {
    app.get("/", async (req: Request, res: Response) => {
        // Define the type of the data that will be passed to the EJS template (for type safety)
        interface RouteData {
            currentUser: string;
            body: string;
            views: number;
        }

        // We have to verify that views is defined, otherwise ts will throw an error
        if (req.session.views) {
            req.session.views++;
        } else {
            req.session.views = 1;
        }

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

        // Render the EJS template with the data
        // We have to use the `satisfies` operator to make sure that the data passed to the template is of the correct type
        res.render("index.ejs", {
            currentUser: username,
            body: "Rendered using EJS!!!",
            views: req.session.views,
        } satisfies RouteData);
    });
};
