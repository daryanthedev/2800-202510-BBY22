import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { damageEnemy } from "../../utils/enemyUtils.js";

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

        try {
            await damageEnemy(req, database);
        } catch (err) {
            console.error("Error damaging enemy:", err);
            res.status(500).send("Internal server error.");
            return;
        }

        res.send();
    });
};
