import { Express, Request, Response } from "express";

/**
 * Registers the /about route to render the about page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/about", (_: Request, res: Response) => {
        res.render("about.ejs");
    });
};
