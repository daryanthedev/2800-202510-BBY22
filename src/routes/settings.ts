import { Express, Request, Response } from "express";
import validateSession from "../middleware/validateSession.js";

/**
 * Registers the /settings route to render the settings page.
 * @param {Express} app - The Express application instance.
 */
export default (app: Express) => {
    app.get("/settings", validateSession, (_: Request, res: Response) => {
        res.render("settings.ejs");
    });

    app.get("/settings/:settingCategory", validateSession, (req: Request, res: Response) => {
        const settingCatagory = req.params.settingCatagory;
        const settingCategories = ["about", "account", "appearance"];

        if (settingCategories.includes(settingCatagory)) {
            res.render(`settings/${settingCatagory}`);
        } else {
            res.status(404).render("error", {
                errorCode: "404",
                errorName: "Page not found",
                errorMessage: "Looks like this path leads to a dead end... even the goblins are confused.",
            });
        }
    });
};
