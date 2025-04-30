import { Express, Request, Response } from "express";

export default (app: Express) => {
    app.get("/logout", (_: Request, res: Response) => {
        res.render("logout.ejs");
    });
};
