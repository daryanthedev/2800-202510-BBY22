import express, { Request, Response } from "express";
import session from "express-session";
import path from "path";
import fs from "fs";

// Load .env file
import "dotenv/config";

// Add custom types to the session object
declare module "express-session" {
    interface SessionData {
        views: number | undefined;
    }
}

const APP = express();
const PORT = process.env.PORT ?? "3000";
// Load the session secret from the environment variable or throw an error if not defined
const NODE_SESSION_SECRET =
    process.env.SESSION_SECRET ??
    (() => {
        throw new Error("SESSION_SECRET environment variable not defined.");
    })();

// Check if the server is running in dev mode or build mode
// If the dist folder is one folder up we are in dev mode, but if it is two folders up then we are in build mode
const IS_DEV = fs.existsSync(path.join(import.meta.dirname, "../dist"));
const PUBLIC_ROOT = IS_DEV ? path.join(import.meta.dirname, "../public") : path.join(import.meta.dirname, "../../public");
const DIST_PUBLIC_ROOT = IS_DEV ? path.join(import.meta.dirname, "../dist/public") : path.join(import.meta.dirname, "../public");

APP.set("view engine", "ejs");

APP.use(
    session({
        secret: NODE_SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
    }),
);

// Use the Typescript that was compiled to JS in the dist folder
APP.all("/{*a}", express.static(DIST_PUBLIC_ROOT));

// Example route to test sessions and EJS rendering
APP.get("/test", (req: Request, res: Response) => {
    // Define the type of the data that will be passed to the EJS template (for type safety)
    interface TestData {
        body: string;
        views: number;
    }

    // We have to verify that views is defined, otherwise ts will throw an error
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }

    // Render the EJS template with the data
    // We have to use the `satisfies` operator to make sure that the data passed to the template is of the correct type
    res.render("test.ejs", {
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
