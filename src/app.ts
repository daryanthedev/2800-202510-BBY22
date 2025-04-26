import express, { Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';

// Load .env file
import 'dotenv/config';

declare module 'express-session' {
    interface SessionData {
      views: number | undefined;
    }
}

const APP = express();
const PORT = process.env.PORT || 3000;
const NODE_SESSION_SECRET = process.env.SESSION_SECRET || (()=>{throw new Error("SESSION_SECRET environment variable not defined.")})();

const IS_DEV = fs.existsSync(path.join(import.meta.dirname, "../dist"));
const PUBLIC_ROOT = IS_DEV ? path.join(import.meta.dirname, "../public") : path.join(import.meta.dirname, "../../public");
const JS_ROOT = IS_DEV ? path.join(import.meta.dirname, "../dist/") : path.join(import.meta.dirname, "../")

APP.set('view engine', 'ejs');

APP.use(session({
    secret: NODE_SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
}));

// Use the built Typescript
APP.all("/js/{*a}", express.static(JS_ROOT));

APP.get("/test", (req: Request, res: Response) => {
    type TestData = {
        body: string,
        views: number,
    };

    if (req.session.views) {
        req.session.views++;
    }
    else {
        req.session.views = 1;
    }

    const renderData: TestData = {
        body: "Rendered using EJS!!!",
        views: req.session.views,
    };

    res.render("test.ejs", renderData);
})

APP.use(express.static(PUBLIC_ROOT));

APP.get("/{*a}", (_, res: Response) => {
    res.status(404).send("404");
})

APP.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
