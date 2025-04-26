import express, { Response } from 'express';
import path from 'path';
import fs from 'fs';

const APP = express();
const PORT = process.env.PORT || 3000;

const IS_DEV = fs.existsSync(path.join(import.meta.dirname, "../dist"));
const PUBLIC_ROOT = IS_DEV ? path.join(import.meta.dirname, "../public") : path.join(import.meta.dirname, "../../public");
const JS_ROOT = IS_DEV ? path.join(import.meta.dirname, "../dist/") : path.join(import.meta.dirname, "../")

// Use the built Typescript
APP.all("/js/{*a}", express.static(JS_ROOT));

APP.use(express.static(PUBLIC_ROOT));

APP.get("/{*a}", (_, res: Response) => {
    res.status(404).send("404");
})

APP.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
