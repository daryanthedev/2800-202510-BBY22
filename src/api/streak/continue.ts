import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

/**
 * Registers the /api/streak/continue endpoint to update the user's last streak date to now.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 */
export default (app: Express, database: Db) => {
    app.post("/api/streak/continue", (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            res.status(401).send("Please authenticate first.");
            return;
        }
        database
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
            )
            .then(() => {
                res.send();
            })
            .catch((err: unknown) => {
                console.error("Error inserting user into database:", err);
                res.status(500).send("Internal server error.");
            });
    });
};
