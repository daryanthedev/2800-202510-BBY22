import { Db, ObjectId } from "mongodb";
import { Request } from "express";
import { isUsersSchema } from "../schema.js";

/**
 * Interface for the enemy's information.
 */
interface EnemyInfo {
    health: number;
}

/**
 * Retrieves the current enemy's health for the logged-in user from the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Db} database - The MongoDB database instance.
 * @returns {Promise<EnemyInfo>} The info about the enemy
 * @throws Will throw an error if the user is not found or if the user's data is not valid.
 */
async function getEnemyInfo(req: Request, database: Db): Promise<EnemyInfo> {
    // Create variable with all of user's data within it
    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });

    // Ensure user is valid
    if (user === null) {
        throw new Error("User not found");
    }
    if (!isUsersSchema(user)) {
        throw new Error("User data is not valid");
    }

    return {
        health: user.enemyHealth,
    };
}

/**
 * Applies damage to the user's enemy by subtracting the user's points from the enemy's health.
 * If the enemy's health drops to zero or below, a new enemy is created with increased health,
 * the health modifier is incremented, and the user's points are reset.
 * If the enemy survives, its health is updated and the user's points are reset.
 *
 * @param {Request} req - The Express request object, expected to contain the session with `loggedInUserId`.
 * @param {Db} database - The MongoDB database instance.
 * @returns {Promise<undefined | null>} A promise that resolves when the operation is complete, or `null` if the user is not found.
 * @throws Will throw an error if the user's points, enemy health, or enemy health modifier are not numbers.
 */
async function takeDamage(req: Request, database: Db): Promise<undefined | null> {
    // Create variable with all of user's data within it
    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });
    // Ensure user isn't null
    if (user === null) {
        return null;
    }

    // Check the type of the data pulled from the DB, if not a number throw error
    if (typeof user.points !== "number") {
        throw new Error("points must be a number");
    }
    if (typeof user.enemyHealth !== "number") {
        throw new Error("enemy's health must be a number");
    }
    if (typeof user.enemyHealthModifier !== "number") {
        throw new Error("enemy's health modifier must be a number");
    }
    // Default for enemy's hp,
    const DEFAULT_MONSTER_HP = 100;
    // Pull user's enemy health modifier from the DB, if used update it after
    const MONSTER_HP_MODIFIER: number = user.enemyHealthModifier;
    // Check if the damage is going to kill the enemy, store this in a variable
    const hpCheck: number = user.enemyHealth - user.points;

    // If the enemy is dead, create a new one
    if (hpCheck <= 0) {
        await database.collection("users").updateOne(
            {
                //Get user ID from session
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    // Create new enemy with modified HP value
                    enemyHealth: DEFAULT_MONSTER_HP + MONSTER_HP_MODIFIER,
                    // Adjust the user's modifier after creating new enemy
                    enemyHealthModifier: user.enemyHealthModifier + 10,
                    // Reset the user's points
                    points: 0,
                },
            },
        );
    } // If enemy not dead, adjust its HP
    else {
        await database.collection("users").updateOne(
            {
                // Get user ID from session
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    // Adjust enemy's HP
                    enemyHealth: user.enemyHealth - user.points,
                    // Reset user's points
                    points: 0,
                },
            },
        );
    }
}

export { getEnemyInfo, takeDamage };
export type { EnemyInfo };
