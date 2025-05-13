import { Express, Request, Response } from "express";

export default (app: Express) => {
    app.get("/about", (_: Request, res: Response) => {
        res.render("about.ejs");
    });
};
