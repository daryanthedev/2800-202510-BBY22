import express, { Request, Response } from "express";
import "dotenv/config"; // Load .env file

import sessionMiddleware from "./utils/sessionMiddleware.js";
import database from "./utils/databaseConnection.js";
import { isUsersSchema } from "./schema.js";
import { ObjectId } from "mongodb";

if (process.env.MONGODB_DBNAME === undefined) {
    throw new Error("MONGODB_DBNAME environment variable not defined.");
}

const MONGODB_DATABASE = database.db(process.env.MONGODB_DBNAME);

// Add custom types to the session object
declare module "express-session" {
    interface SessionData {
        views: number;
        loggedInUserId: string;
    }
}

const APP = express();
const PORT = process.env.PORT ?? "3000";

// Check if the server is running in dev mode or build mode
// If the dist folder is one folder up we are in dev mode, but if it is two folders up then we are in build mode

import getFolders from "./utils/folders.js";
const { PUBLIC_ROOT, DIST_PUBLIC_ROOT } = getFolders(import.meta.dirname);

APP.set("view engine", "ejs");

APP.use(express.urlencoded({ extended: true }));

APP.use(express.json({ type: "application/json" }));

APP.use(sessionMiddleware());

// Use the Typescript that was compiled to JS in the dist folder
APP.all("/{*a}", express.static(DIST_PUBLIC_ROOT));

await (await import("./api/index.js")).default(APP, MONGODB_DATABASE);
await (await import("./routes/index.js")).default(APP);

// Example route to test sessions and EJS rendering
APP.get("/test", async (req: Request, res: Response) => {
    // Define the type of the data that will be passed to the EJS template (for type safety)
    interface TestData {
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
        const user = await MONGODB_DATABASE.collection("users").findOne({ _id: new ObjectId(req.session.loggedInUserId) });
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
    res.render("test.ejs", {
        currentUser: username,
        body: "Rendered using EJS!!!",
        views: req.session.views,
    } satisfies TestData);
});

// Use static middleware to serve static files from the public folder
APP.use(express.static(PUBLIC_ROOT));

// Serve a 404 page for any other routes
APP.get("/{*a}", (_, res: Response) => {
    res.status(404).send("404");
});

APP.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
