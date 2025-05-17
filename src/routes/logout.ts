import { Express, Request, Response } from "express";

/**
 * Registers the /logout route to render the logout page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/logout", (_: Request, res: Response) => {
        res.render("logout.ejs");
    });
};
