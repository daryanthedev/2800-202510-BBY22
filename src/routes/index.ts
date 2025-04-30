import { Express } from "express";
import { Db } from "mongodb";

export default async (app: Express, database: Db) => {
    (await import("./register")).default(app);
    (await import("./login")).default(app, database);
};
