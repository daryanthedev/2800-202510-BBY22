import { Db, ObjectId, WithId } from "mongodb";
import { isUsersSchema, UsersSchema } from "../schema.js";

/**
 * Gets a user from the database using their ID
 * @param {Db} database - The database to search in
 * @param {ObjectId} userId - The ID of the user
 * @returns {Promise<WithId<UsersSchema>>} The user's information
 */
async function getCurrentUser(database: Db, userId: ObjectId): Promise<WithId<UsersSchema>> {
    const user = await database.collection("users").findOne({
        _id: userId,
    });

    // Ensure user is valid
    if (user === null) {
        throw new Error("User not found");
    }
    if (!isUsersSchema(user)) {
        throw new Error("User data is not valid");
    }

    return user;
}

export default getCurrentUser;
