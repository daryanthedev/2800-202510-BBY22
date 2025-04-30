import { Express, Request, Response } from "express";

export default (app: Express) => {
    app.get("/register", (_: Request, res: Response) => {
        res.render("register.ejs");
    });
};
