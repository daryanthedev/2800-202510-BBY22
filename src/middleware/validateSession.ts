import { Request, Response } from "express";

export default (req: Request, res: Response, next: () => void) => {
    if (req.session.loggedInUserId === undefined) {
        res.redirect("/");
    } else {
        next();
    }
};
