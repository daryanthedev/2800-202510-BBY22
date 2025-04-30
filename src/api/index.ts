import { Express } from "express";
import { Db } from "mongodb";

export default async (app: Express, database: Db) => {
    (await import("./login.js")).default(app, database);
    (await import("./register.js")).default(app, database);
};
