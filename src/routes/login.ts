import { Express, Request, Response } from "express";

/**
 * Registers the /login route to render the login page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/login", (_: Request, res: Response) => {
        res.render("login.ejs");
    });
};
