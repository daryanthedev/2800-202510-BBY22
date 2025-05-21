// src/routes/profile.ts
import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";

export default (app: Express, db: Db) => {
    app.get("/profile", async (req: Request, res: Response) => {
        const userId = req.session.loggedInUserId;
        if (!userId) {
            return res.redirect("/login");
        }

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.redirect("/login");
        }

        res.render("profile", { user });
    });
};
