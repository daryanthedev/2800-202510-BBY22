import { Db, ObjectId } from "mongodb";
import { Request } from "express";

/*
Pulls Monster information from the database
 */
async function getMonster(req: Request, database: Db) {
    //Create variable with all of user's data within it
    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });
    //Ensure user isn't null

    if (user === null) {
        return null;
    }
    //Check if the monster's health is a number, if so, return the monster's health
    if (typeof user.monsterHealth === "number") {
        return user.monsterHealth;
    }
    //If not, return null
    return null;
}

/*
Adjust monster's HP when damage needs to be taken. If monster dies, create new monster in user's DB
 */
async function takeDamage(req: Request, database: Db) {
    //Create variable with all of user's data within it
    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });
    //Ensure user isn't null
    if (user === null) {
        return null;
    }

    //Check the type of the data pulled from the DB, if not a number throw error
    if (typeof user.points !== "number") {
        throw new Error("points must be a number");
    }
    if (typeof user.monsterHealth !== "number") {
        throw new Error("monster's health must be a number");
    }
    if (typeof user.monsterHealthModifier !== "number") {
        throw new Error("monster's health modifier must be a number");
    }
    //Default for monster's hp,
    const DEFAULT_MONSTER_HP = 100;
    //pull user's monster health modifier from the DB, if used update it after
    const MONSTER_HP_MODIFIER: number = user.monsterHealthModifier;
    //Check if the damage is going to kill the monster, store this in a variable
    const hpCheck: number = user.monsterHealth - user.points;

    //If the monster is dead, create a new one
    if (hpCheck <= 0) {
        await database.collection("users").updateOne(
            {
                //Get user ID from session
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    //Create new monster with modified HP value
                    monsterHealth: DEFAULT_MONSTER_HP + MONSTER_HP_MODIFIER,
                    //Adjust the user's modifier after creating new monster
                    monsterHealthModifier: user.monsterHealthModifier + 10,
                    //Reset the user's points
                    points: 0,
                },
            },
        );
    } //If monster not dead, adjust its HP
    else {
        await database.collection("users").updateOne(
            {
                //Get user ID from session
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    //Adjust monsters HP
                    monsterHealth: user.monsterHealth - user.points,
                    //Reset user's points
                    points: 0,
                },
            },
        );
    }
}

export { getMonster, takeDamage };
