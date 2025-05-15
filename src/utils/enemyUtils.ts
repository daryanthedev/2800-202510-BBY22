import { Db, ObjectId } from "mongodb";
import { Request } from "express";
import { isUsersSchema } from "../schema.js";

// Default for enemy's HP
const DEFAULT_MONSTER_HP = 100;

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
 * @param {number} damage - The amount of damage to apply to the enemy.
 * @returns {Promise<EnemyInfo>} A promise that resolves to the updated enemy information.
 * @throws Will throw an error if the user's points, enemy health, or enemy health modifier are not numbers.
 */
async function damageEnemy(req: Request, database: Db, damage: number): Promise<EnemyInfo> {
    if (damage <= 0) {
        throw new Error("Damage must be greater than 0");
    }

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

    // Cap the damage to the user's points
    if (user.points < damage) {
        damage = user.points;
    }
    // Cap the damage to the enemy's health
    if (user.enemyHealth < damage) {
        damage = user.enemyHealth;
    }

    // Check the enemies new HP
    const newEnemyHealth = user.enemyHealth - damage;
    const newUserPoints = user.points - damage;

    if (newEnemyHealth <= 0) {
        user.enemyHealthModifier += 10;

        // If the enemy is dead, create a new one
        await database.collection("users").updateOne(
            {
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    // Create new enemy with modified HP value
                    enemyHealth: DEFAULT_MONSTER_HP + user.enemyHealthModifier,
                    // Adjust the user's modifier after creating new enemy
                    enemyHealthModifier: user.enemyHealthModifier,
                    points: newUserPoints,
                },
            },
        );
    } else {
        // If the enemy is not dead, adjust its HP
        await database.collection("users").updateOne(
            {
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    enemyHealth: newEnemyHealth,
                    points: newUserPoints,
                },
            },
        );
    }

    return {
        health: newEnemyHealth,
    };
}

export { getEnemyInfo, damageEnemy };
export type { EnemyInfo };
