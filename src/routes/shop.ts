import { Express, Request, Response } from "express";
import validateSession from "../middleware/validateSession.js";
console.log("Loading shop route");

/**
 * Registers the /shop route to render the shop page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/shop", validateSession, (_: Request, res: Response) => {
        res.render("shop.ejs");
    });
};
