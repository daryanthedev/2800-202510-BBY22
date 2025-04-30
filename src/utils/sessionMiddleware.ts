import MongoStore from "connect-mongo";
import session from "express-session";

import mongodbUri from "./mongodbUri.js";

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

const MONGO_STORE = MongoStore.create({
    mongoUrl: mongodbUri,
    crypto: {
        secret: MONGODB_SESSION_SECRET,
    },
});

export default () =>
    session({
        secret: NODE_SESSION_SECRET,
        store: MONGO_STORE,
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: SESSION_EXPIRE_TIME,
        },
    });
