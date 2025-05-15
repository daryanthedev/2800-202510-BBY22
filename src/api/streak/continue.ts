import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import StatusError from "../../utils/statusError.js";

/**
 * Registers the /api/streak/continue endpoint to update the user's last streak date to now.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.post("/api/streak/continue", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            throw new StatusError(401, "Please authenticate first");
        }

        await database
            .collection("users")
            .updateOne(
                {
                    _id: new ObjectId(req.session.loggedInUserId),
                },
                {
                    $set: {
                        lastStreakDate: new Date(),
                    },
                },
            );
        res.send();
    });
};
