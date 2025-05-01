import fs from "fs";
import path from "path";

export default (appScriptPath: string) => {
    const IS_DEV = fs.existsSync(path.join(appScriptPath, "../dist"));
    const PUBLIC_ROOT = IS_DEV ? path.join(appScriptPath, "../public") : path.join(appScriptPath, "../../public");
    const DIST_PUBLIC_ROOT = IS_DEV ? path.join(appScriptPath, "../dist/public") : path.join(appScriptPath, "../public");

    return { PUBLIC_ROOT, DIST_PUBLIC_ROOT };
};
