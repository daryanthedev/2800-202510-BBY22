import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { GoogleGenAI } from "@google/genai";
import { getUserChallenges } from "../utils/challengeUtils.js";

/**
 * Registers the / route to render the index page.
 * @param {Express} app - The Express application instance.
 * @param {Db} database - The MongoDB database instance.
 * @param {GoogleGenAI} ai - The GoogleGenAI instance.
 */
export default (app: Express, database: Db, ai: GoogleGenAI) => {
    app.get("/", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId !== undefined) {
            const challenges = await getUserChallenges(req, database, ai);
            res.render("home", { challenges });
        } else {
            res.render("landing");
        }
    });
};
