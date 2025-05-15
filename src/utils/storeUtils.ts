import { Db, ObjectId } from "mongodb";
import { Request } from "express";
import { isUsersSchema } from "../schema.js";

/**
 * Retrieves the price of an item from the database by its name.
 * @param {string} itemName - The name of the item to look up.
 * @param {Db} database - The MongoDB database instance.
 * @returns The price of the item as a number, or null if not found.
 * @throws Error if the item's price is not a number.
 */
async function getItemPrice(itemName: string, database: Db) {
    // Get the item from the database by querying for the items name
    const item = await database.collection("items").findOne({
        name: itemName,
    });
    // Check if item is null
    if (item === null) {
        return null;
    }
    // Ensure the items price is a number
    if (typeof item.price !== "number") {
        throw new Error("price must be a number");
    }
    // Return the price of the item
    return item.price;
}

/**
 * Gives the specified item to the user if they have enough points.
 * Updates the user's inventory and deducts the item's price from their points.
 * @param {Request} req - The Express request object containing the session user ID.
 * @param {Db} database - The MongoDB database instance.
 * @param {string} itemName - The name of the item to give to the user.
 * @returns void or throws an error if the operation fails.
 */
async function giveItem(req: Request, database: Db, itemName: string) {
    // Get the user's information from the user's ID
    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });

    // Check if user is null
    if (user === null) {
        return null;
    }
    // Ensure valid user
    if (!isUsersSchema(user)) {
        throw new Error("Must be a valid user");
    }
    // Get price of item
    const price: number | null = await getItemPrice(itemName, database);
    // Check that the item's price isn't null
    if (price === null) {
        throw new Error("Item price cannot be null");
    }
    // If the price is less or Equal to the user's available points, give them the item
    if (price <= user.points) {
        // Add the item to the user's inventory
        user.inventory.push(itemName);
        // Update user's database with the new inventory
        await database.collection("users").updateOne(
            {
                _id: new ObjectId(req.session.loggedInUserId),
            },
            {
                $set: {
                    inventory: user.inventory,
                    points: user.points - price,
                },
            },
        );
    } else {
        throw new Error("Cannot buy item, you do not have enough points");
    }
}

export { giveItem };
