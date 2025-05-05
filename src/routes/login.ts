import { Express, Request, Response } from "express";

export default (app: Express) => {
    app.get("/login", (_: Request, res: Response) => {
        res.render("login.ejs");
    });
};
