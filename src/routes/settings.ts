import { Express, Request, Response } from "express";
import validateSession from "../middleware/validateSession.js";

/**
 * Registers the /settings route to render the settings page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/settings", validateSession, (_: Request, res: Response) => {
        res.render("settings.ejs");
    });

    app.get("/settings/account", validateSession, (_: Request, res: Response) => {
        res.render("settings/account.ejs");
    });
};
