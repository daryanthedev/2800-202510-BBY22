import { Express, Request, Response } from "express";
console.log("Loading shop route");

/**
 * Registers the /shop route to render the shop page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    console.log(app);
    console.log("Rendering shop page");
    app.get("/shop", (_: Request, res: Response) => {
        res.render("shop.ejs");
    });
};
