import express, { Response } from "express";
import "dotenv/config"; // Load .env file

import sessionMiddleware from "./utils/sessionMiddleware.js";
import database from "./utils/databaseConnection.js";

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
await (await import("./routes/index.js")).default(APP, MONGODB_DATABASE);

// Use static middleware to serve static files from the public folder
APP.use(express.static(PUBLIC_ROOT));

// Serve a 404 page for any other routes
APP.use((_, res: Response) => {
    res.status(404).send("404");
});

APP.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
