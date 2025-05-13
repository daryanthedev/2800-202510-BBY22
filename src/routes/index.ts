import { Express } from "express";
import { Db } from "mongodb";

export default async (app: Express, database: Db) => {
    (await import("./root.js")).default(app, database);
    (await import("./register.js")).default(app);
    (await import("./login.js")).default(app);
    (await import("./logout.js")).default(app);
    (await import("./about.js")).default(app);
};
