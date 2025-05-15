import { Express, Request, Response } from "express";

/**
 * Registers the /api/logout endpoint to clear the user session.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.post("/api/auth/logout", (req: Request, res: Response) => {
        // Clear the loggedInUserId from the session to log out the user
        req.session.loggedInUserId = undefined;
        res.send();
    });
};
