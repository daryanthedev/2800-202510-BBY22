import { Db, ObjectId } from "mongodb";
import { Request } from "express";
import { isUsersSchema } from "../schema.js";

/**
 * Interface for the enemy's information.
 */
interface ItemInfo {
    name: string;
    price: number;
    image: string;
}

/**
 * Retrieves the price of an item from the database by its name.
 * @param {string} itemName - The name of the item to look up.
 * @param {Db} database - The MongoDB database instance.
 * @returns {Promise<ItemInfo>} The item's information.
 * @throws Error if the item's price is not a number.
 */
async function getItem(itemName: string, database: Db): Promise<ItemInfo> {
    // Get the item from the database by querying for the items name
    const item = await database.collection("items").findOne({
        name: itemName,
    });

    // Check if item is null
    if (item === null) {
        throw new Error("Item not found");
    }

    // Ensure the items price is a number
    if (typeof item.price !== "number") {
        throw new Error("Items must have a price");
    }
    if (item.price <= 0) {
        throw new Error("Item price must be greater than 0");
    }

    if (typeof item.name !== "string") {
        throw new Error("Items must have a name");
    }
    if (item.name.trim() === "") {
        throw new Error("Item name must not be blank");
    }

    if (typeof item.image !== "string") {
        throw new Error("Item must have an image");
    }

    // Return the item info
    return {
        price: item.price,
        name: item.name,
        image: item.image,
    };
}

/**
 * Gives the specified item to the user if they have enough points.
 * Updates the user's inventory and deducts the item's price from their points.
 * @param {Request} req - The Express request object containing the session user ID.
 * @param {Db} database - The MongoDB database instance.
 * @param {string} itemName - The name of the item to give to the user.
 * @returns {Promise<undefined>} void or throws an error if the operation fails.
 */
async function buyItem(req: Request, database: Db, itemName: string): Promise<undefined> {
    // Get the user's information from the user's ID
    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });

    // Ensure user is valid
    if (user === null) {
        throw new Error("User not found");
    }
    if (!isUsersSchema(user)) {
        throw new Error("User data is not valid");
    }

    const item = await getItem(itemName, database);

    // If the user cannot afford the item, throw an error
    if (user.points < item.price) {
        throw new Error("Cannot buy item, you do not have enough points");
    }

    // Add the item to the user's inventory
    user.inventory.push(itemName);

    // Update users database with the new inventory and update their points
    await database.collection("users").updateOne(
        {
            _id: new ObjectId(req.session.loggedInUserId),
        },
        {
            $set: {
                inventory: user.inventory,
                points: user.points - item.price,
            },
        },
    );
}

export { buyItem };
