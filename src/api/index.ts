import { Express } from "express";
import { Db } from "mongodb";

export default async (app: Express, database: Db) => {
    (await import("./register.js")).default(app, database);
    (await import("./login.js")).default(app, database);
    (await import("./logout.js")).default(app);
    (await import("./weather.js")).default(app);
    (await import("./streak.js")).default(app, database);
};
