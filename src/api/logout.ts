import { Express, Request, Response } from "express";

export default (app: Express) => {
    app.post("/api/logout", (req: Request, res: Response) => {
        req.session.loggedInUserId = undefined;
        res.send();
    });
};
