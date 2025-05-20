import { Express, Request, Response } from "express";
import { Db, ObjectId, WithId } from "mongodb";
import { GoogleGenAI } from "@google/genai";
import { getUserChallenges } from "../utils/challengeUtils.js";
import { UsersSchema } from "../schema.js";
import getCurrentUser from "../utils/getCurrentUser.js";
import StatusError from "../utils/statusError.js";

/**
 * Registers the / route to render the index page.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 * @param {GoogleGenAI} ai - The GoogleGenAI instance.
 */
export default (app: Express, database: Db, ai: GoogleGenAI) => {
    app.get("/", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId !== undefined) {
            let user: WithId<UsersSchema>;
            try {
                user = await getCurrentUser(database, new ObjectId(req.session.loggedInUserId));
            } catch (_) {
                throw new StatusError(500);
            }
            const challenges = await getUserChallenges(user, database, ai);
            res.render("home", { challenges, user });
        } else {
            res.render("landing");
        }
    });
};
