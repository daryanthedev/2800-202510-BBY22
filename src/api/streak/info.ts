import { Express, Request, Response } from "express";
import { isUsersSchema } from "../../schema.js";
import { Db, ObjectId } from "mongodb";
import StatusError from "../../utils/statusError.js";

/**
 * Registers the /api/streak/info endpoint to provide the user's last streak date.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.get("/api/streak/info", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            throw new StatusError(401, "Please authenticate first");
        }

        const user = await database
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.loggedInUserId),
            });

        if (!isUsersSchema(user)) {
            throw new Error("User from database does not match expected schema");
        }
        res.json(
            JSON.stringify({
                lastStreakDate: user.lastStreakDate,
            }),
        );
    });
};
