import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { getEnemy } from "../../utils/enemyUtils.js";

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
        const monsterHealth = await getEnemy(req, database);

        if(monsterHealth === null) {
            console.error("Error getting monster health.");
            res.status(500).send("Internal server error.");
        }
        res.type("application/json").send(
            JSON.stringify({
                monsterHealth,
            }),
        );
    });
};
