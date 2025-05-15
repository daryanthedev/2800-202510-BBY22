import { Express, Request, Response } from "express";

/**
 * Registers the / route to render the index page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId !== undefined) {
            res.render("home");
        } else {
            res.render("landing");
        }
    });
};
