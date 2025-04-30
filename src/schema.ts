import { WithId, Document } from "mongodb";

interface UsersSchema extends WithId<Document> {
    username: string,
    email: string,
    passwordHash: string,
}

function isUsersSchema(data: WithId<Document> | null): data is UsersSchema {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;
    return typeof obj.username === "string" && typeof obj.email === "string" && typeof obj.passwordHash === "string";
}

export type { UsersSchema };

export { isUsersSchema };
