import fs from "fs";
import path from "path";

/**
 * Determines the public and dist public root directories based on the app script path.
 * @param {string} appScriptPath - The directory of the running script.
 * @returns {{ PUBLIC_ROOT: string, DIST_PUBLIC_ROOT: string }}
 */
export default (appScriptPath: string): { PUBLIC_ROOT: string; DIST_PUBLIC_ROOT: string } => {
    // If the dist folder exists one level up, we are in dev mode
    const IS_DEV = fs.existsSync(path.join(appScriptPath, "../dist"));
    const PUBLIC_ROOT = IS_DEV ? path.join(appScriptPath, "../public") : path.join(appScriptPath, "../../public");
    const DIST_PUBLIC_ROOT = IS_DEV ? path.join(appScriptPath, "../dist/public") : path.join(appScriptPath, "../public");

    return { PUBLIC_ROOT, DIST_PUBLIC_ROOT };
};
