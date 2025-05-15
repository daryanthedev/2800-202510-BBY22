import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

import { isUsername, Username } from "../../schema.js";

// Data required to set a new username for the user.
interface SetUsernameData {
    username: Username;
}

/**
 * Type guard to check if an object is SetUsernameData.
 * @param {unknown} data
 * @returns {data is SetUsernameData}
 */
function isSetUsernameData(data: unknown): data is SetUsernameData {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.username === "string" && isUsername(obj.username);
}

/**
 * Registers the /api/account/setUsername endpoint to update a user's username.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.post("/api/account/setUsername", (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            res.status(401).send("Please authenticate first.");
            return;
        }
        if (isSetUsernameData(req.body)) {
            const { username } = req.body;
            database
                .collection("users")
                .updateOne(
                    {
                        _id: new ObjectId(req.session.loggedInUserId),
                    },
                    {
                        $set: {
                            username,
                        },
                    },
                )
                .then(() => {
                    res.send();
                })
                .catch((err: unknown) => {
                    console.error("Error updating username:", err);
                    res.status(500).send("Internal server error.");
                });
        } else {
            res.status(400).send("Invalid data.");
        }
    });
};
