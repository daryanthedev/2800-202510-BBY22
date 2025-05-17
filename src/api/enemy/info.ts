import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { getEnemyInfo } from "../../utils/enemyUtils.js";
import StatusError from "../../utils/statusError.js";

/**
 * Registers the /api/enemy/info endpoint to provide the enemy's info.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.get("/api/enemy/info", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            throw new StatusError(401, "Please authenticate first");
        }

        const enemyInfo = await getEnemyInfo(req, database);
        res.type("application/json").send(JSON.stringify(enemyInfo));
    });
};
