import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

import { isUsername, Username } from "../../schema.js";
import StatusError from "../../utils/statusError.js";

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
    app.post("/api/account/setUsername", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            throw new StatusError(401, "Please authenticate first");
        }
        if (isSetUsernameData(req.body)) {
            const { username } = req.body;
            await database
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
                );
            res.send();
        } else {
            throw new StatusError(400, "Invalid data");
        }
    });
};
