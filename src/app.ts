import express, { Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
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

// Load the session expiration time from the environment variable or default to 1 day
const SESSION_EXPIRE_TIME = (() => {
    if (process.env.SESSION_EXPIRE_TIME === undefined) {
        return 1000 * 60 * 60 * 24; // default to 1 day
    }

    const PARSED_SESSION_EXPIRE_TIME = parseInt(process.env.SESSION_EXPIRE_TIME);
    if (isNaN(PARSED_SESSION_EXPIRE_TIME)) {
        throw new Error("SESSION_EXPIRE_TIME environment variable is not a number.");
    }
    if (PARSED_SESSION_EXPIRE_TIME <= 0) {
        throw new Error("SESSION_EXPIRE_TIME environment variable is not a positive number.");
    }
    return PARSED_SESSION_EXPIRE_TIME;
})();

// Load the session secret from the environment variable or throw an error if not defined
const NODE_SESSION_SECRET =
    process.env.NODE_SESSION_SECRET ??
    (() => {
        throw new Error("NODE_SESSION_SECRET environment variable not defined.");
    })();
const MONGODB_SESSION_SECRET =
    process.env.MONGODB_SESSION_SECRET ??
    (() => {
        throw new Error("MONGODB_SESSION_SECRET environment variable not defined.");
    })();

// Verify that the MONGODB environment variables are defined
if (process.env.MONGODB_USERNAME === undefined) {
    throw new Error("MONGODB_USERNAME environment variable not defined.");
}
if (process.env.MONGODB_PASSWORD === undefined) {
    throw new Error("MONGODB_PASSWORD environment variable not defined.");
}
if (process.env.MONGODB_HOST === undefined) {
    throw new Error("MONGODB_HOST environment variable not defined.");
}
if (process.env.MONGODB_DBNAME === undefined) {
    throw new Error("MONGODB_DBNAME environment variable not defined.");
}
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}`;

const MONGO_STORE = MongoStore.create({
    mongoUrl: MONGODB_URI,
    crypto: {
        secret: MONGODB_SESSION_SECRET,
    },
});

// Check if the server is running in dev mode or build mode
// If the dist folder is one folder up we are in dev mode, but if it is two folders up then we are in build mode
const IS_DEV = fs.existsSync(path.join(import.meta.dirname, "../dist"));
const PUBLIC_ROOT = IS_DEV ? path.join(import.meta.dirname, "../public") : path.join(import.meta.dirname, "../../public");
const DIST_PUBLIC_ROOT = IS_DEV ? path.join(import.meta.dirname, "../dist/public") : path.join(import.meta.dirname, "../public");

APP.set("view engine", "ejs");

APP.use(
    session({
        secret: NODE_SESSION_SECRET,
        store: MONGO_STORE,
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: SESSION_EXPIRE_TIME,
        },
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
