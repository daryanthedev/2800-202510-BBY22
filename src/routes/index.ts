import { Express } from "express";

export default async (app: Express) => {
    (await import("./register.js")).default(app);
    (await import("./login.js")).default(app);
    (await import("./logout.js")).default(app);
};
