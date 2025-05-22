// src/routes/profile.ts
import { Express, Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import getCurrentUser from "../utils/getCurrentUser.js";
import StatusError     from "../utils/statusError.js";
import { UsersSchema } from "../schema.js";

export default (app: Express, database: Db) => {
  //
  // 1) VIEW PROFILE (no changes here)
  //
  app.get("/profile", async (req: Request, res: Response) => {
    if (!req.session.loggedInUserId) {
      throw new StatusError(401, "Please log in first");
    }

    // fetch user from DB
    const user = (await getCurrentUser(
      database,
      new ObjectId(req.session.loggedInUserId)
    )) as UsersSchema & { _id: ObjectId };

    // fetch completed challenge names
    const completedIds = user.CompletedTasks.map(id => new ObjectId(id));
    const completedTasks = completedIds.length
      ? await database
          .collection("challenges")
          .find({ _id: { $in: completedIds } })
          .project({ name: 1, _id: 0 })
          .toArray()
      : [];

    // render profile.ejs with user + completedTasks
    res.render("profile", { user, completedTasks });
  });

  //
  // 2) SHOW EDIT PROFILE FORM
  //
  app.get("/profile/edit", async (req: Request, res: Response) => {
    if (!req.session.loggedInUserId) {
      throw new StatusError(401, "Please log in first");
    }

    // fetch user so we can prefill the form
    const user = (await getCurrentUser(
      database,
      new ObjectId(req.session.loggedInUserId)
    )) as UsersSchema & { _id: ObjectId };

    res.render("edit-profile", { user });
  });

  //
  // 3) HANDLE EDIT SUBMISSION
  //
  app.post("/profile/edit", async (req: Request, res: Response) => {
    if (!req.session.loggedInUserId) {
      throw new StatusError(401, "Please log in first");
    }

    // pull new values from the form
    const { username, bio } = req.body as { username: string; bio: string };

    // basic server-side validation
    if (typeof username !== "string" || username.trim().length < 3) {
      throw new StatusError(400, "Username must be at least 3 characters");
    }
    if (typeof bio !== "string") {
      throw new StatusError(400, "Bio is required");
    }

    // save to Mongo
    await database.collection("users").updateOne(
      { _id: new ObjectId(req.session.loggedInUserId) },
      { $set: { username: username.trim(), bio: bio.trim() } }
    );

    // go back to the profile page
    res.redirect("/profile");
  });
};
