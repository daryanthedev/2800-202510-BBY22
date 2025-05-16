import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { giveItem } from "../utils/storeUtils.js";

interface Item {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    price: number;
}

export default (app: Express, database: Db) => {
    app.get("/shop", async (req: Request, res: Response) => {
        const rawItems = await database.collection<Item>("items").find({}).toArray();
        const items = rawItems.map(i => ({
            _id: i._id.toString(),
            name: i.name,
            description: i.description,
            imageUrl: i.imageUrl ?? "/images/placeholder.png",
            price: i.price,
        }));
        res.render("shop", { items, error: req.query.error });
    });

    // POST /api/shop/buy -> attempt purchase then redirect back to shop
    app.post("/api/shop/buy", async (req: Request, res: Response) => {
        const { itemName } = req.body as { itemName?: string };
        if (!itemName) {
            res.redirect("/shop");
            return;
        }

        try {
            await giveItem(req, database, itemName);
            res.redirect("/shop");
            return;
        } catch (err: unknown) {
            console.error("Purchase error:", err);
            res.redirect("/shop?error=" + encodeURIComponent((err as Error).message));
            return;
        }
    });
};
