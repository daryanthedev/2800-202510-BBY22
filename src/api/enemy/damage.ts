import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { takeDamage } from "../../utils/monsterUtils.js";

/**
 * Registers the /api/enemy/damage endpoint to provide the ability to damage the enemy.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.get("/api/enemy/damage", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            res.status(401).send("Please authenticate first.");
            return;
        }

        await takeDamage(req, database);

        res.send();
    });
};
