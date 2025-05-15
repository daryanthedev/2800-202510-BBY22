import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { damageEnemy } from "../../utils/enemyUtils.js";

// Data passed to the damage api.
interface DamageData {
    damage: number;
}

/**
 * Type guard to check if an object is DamageData.
 * @param {unknown} data - The data to validate.
 * @returns {data is DamageData} - True if the data matches the DamageData structure.
 */
function isDamageData(data: unknown): data is DamageData {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.damage === "number" && obj.damage > 0;
}

/**
 * Registers the /api/enemy/damage endpoint to provide the ability to damage the enemy.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.post("/api/enemy/damage", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            res.status(401).send("Please authenticate first.");
            return;
        }

        if (!isDamageData(req.body)) {
            res.status(400).send("Invalid damage value.");
            return;
        }

        try {
            const newEnemyStatus = await damageEnemy(req, database, req.body.damage);
            res.json(JSON.stringify(newEnemyStatus));
        } catch (err) {
            console.error("Error damaging enemy:", err);
            res.status(500).send("Internal server error.");
            return;
        }
    });
};
