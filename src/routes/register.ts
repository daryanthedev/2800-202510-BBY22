import { Express, Request, Response } from "express";

/**
 * Registers the /register route to render the register page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/register", (_: Request, res: Response) => {
        res.render("register.ejs");
    });
};
