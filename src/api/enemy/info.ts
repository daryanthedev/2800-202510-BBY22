import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { getEnemyInfo, EnemyInfo } from "../../utils/enemyUtils.js";

/**
 * Registers the /api/enemy/info endpoint to provide the enemy's info.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.get("/api/enemy/info", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            res.status(401).send("Please authenticate first.");
            return;
        }

        let enemyInfo: EnemyInfo;
        try {
            enemyInfo = await getEnemyInfo(req, database);
        } catch (err) {
            console.error("Error getting monster health:", err);
            res.status(500).send("Internal server error.");
            return;
        }

        res.type("application/json").send(JSON.stringify(enemyInfo));
    });
};
