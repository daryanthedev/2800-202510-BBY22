import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { buyItem } from "../utils/storeUtils.js";
import validateSession from "../middleware/validateSession.js";
import StatusError from "../utils/statusError.js";

interface Item {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    price: number;
}

export default (app: Express, database: Db) => {
    // GET /shop → render shop.ejs with all items + notifications
    app.get("/shop", validateSession, async (req: Request, res: Response) => {
        const rawItems = await database.collection<Item>("items").find({}).toArray();
        const items = rawItems.map(i => ({
            _id: i._id.toString(),
            name: i.name,
            description: i.description,
            imageUrl: i.imageUrl ?? "/images/placeholder.png",
            price: i.price,
        }));

        // Safely extract notification params
        const error = typeof req.query.error === "string" ? req.query.error : undefined;
        const success = typeof req.query.success === "string" ? req.query.success : undefined;

        res.render("shop", { items, error, success });
    });

    // POST /api/shop/buy → attempt purchase then redirect back
    app.post("/api/shop/buy", async (req: Request, res: Response) => {
        if (req.session.loggedInUserId === undefined) {
            throw new StatusError(401, "Please authenticate first");
        }
        const { itemName } = req.body as { itemName?: string };
        if (!itemName) {
            res.redirect("/shop");
            return;
        }

        try {
            await buyItem(req, database, itemName);
            // on success, show success message
            res.redirect(`/shop?success=${encodeURIComponent(itemName)}`);
            return;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            res.redirect(`/shop?error=${encodeURIComponent(message)}`);
            return;
        }
    });
};
