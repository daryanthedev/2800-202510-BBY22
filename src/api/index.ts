import { Express } from "express";
import { Db } from "mongodb";

export default async (app: Express, database: Db) => {
    (await import("./login")).default(app, database);
    (await import("./register")).default(app, database);
};
