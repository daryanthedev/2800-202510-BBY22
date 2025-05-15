import express, { Response } from "express";
import "dotenv/config"; // Load .env file

import sessionMiddleware from "./middleware/session.js";
import database from "./utils/databaseConnection.js";
import loadRoutes from "./utils/loadRoutes.js";

if (process.env.MONGODB_DBNAME === undefined) {
    throw new Error("MONGODB_DBNAME environment variable not defined.");
}

const MONGODB_DATABASE = database.db(process.env.MONGODB_DBNAME);

// Use declaration merging to include custom session properties.
declare module "express-session" {
    interface SessionData {
        views: number;
        loggedInUserId: string;
        monsterHealth: number;
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
APP.use(express.static(DIST_PUBLIC_ROOT));

// Register API and route handlers (dynamically)
await Promise.all([loadRoutes("./src/api", APP, MONGODB_DATABASE), loadRoutes("./src/routes", APP, MONGODB_DATABASE)]);

// Use static middleware to serve static files from the public folder
APP.use(express.static(PUBLIC_ROOT));

// Serve a 404 page for any other routes
APP.use((_, res: Response) => {
    res.status(404).render("error", {
        errorCode: "404",
        errorName: "Page not found",
    });
});

APP.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
