import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import getCurrentUser from "../utils/getCurrentUser.js";
import { UsersSchema } from "../schema.js";

export default (app: Express, db: Db) => {
    app.get("/profile", async (req: Request, res: Response) => {
        // 1) fetch user
        const user = (await getCurrentUser(db, new ObjectId(req.session.loggedInUserId))) as UsersSchema & { _id: ObjectId };

        // 2) if they’ve completed tasks, load those challenges
        const completedIds = user.CompletedTasks.map(id => new ObjectId(id));
        const completedTasks = completedIds.length
            ? await db
                .collection("challenges")
                .find({ _id: { $in: completedIds } })
                .project({ name: 1 }) // only need the name
                .toArray()
            : [];

        // 3) render, passing both user and the full task docs
        res.render("profile", { user, completedTasks });
    });
};
