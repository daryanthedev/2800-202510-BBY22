import { Express, Request, Response } from "express";
import { isUsersSchema } from "../../schema.js";
import { Db, ObjectId } from "mongodb";

export default (app: Express, database: Db) => {
    app.get("/api/streak/info", (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            res.status(401).send("Please authenticate first.");
            return;
        }
        database
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.loggedInUserId),
            })
            .then(user => {
                if (isUsersSchema(user)) {
                    res.type("application/json").send(
                        JSON.stringify({
                            lastStreakDate: user.lastStreakDate,
                        }),
                    );
                } else {
                    console.error("User from database does not match expected schema");
                    res.status(500).send("Internal server error.");
                }
            })
            .catch((err: unknown) => {
                console.error("Error getting user from database:", err);
                res.status(500).send("Internal server error.");
            });
    });
};
