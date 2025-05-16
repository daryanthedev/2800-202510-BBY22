import fs from "fs/promises";
import path from "path";

/**
 * Recursively finds all .js and .ts files in a directory.
 * @param {string} dirname - The directory to search.
 * @returns {Promise<string[]>} Array of file paths (without extension).
 */
async function getJsFilesRecursive(dirname: string): Promise<string[]> {
    const files = await fs.readdir(dirname, { withFileTypes: true });
    const jsFiles = files
        .filter(file => file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".ts")))
        .map(file => {
            const ext = path.extname(file.name);
            const baseName = path.basename(file.name, ext);
            return path.join(dirname, baseName);
        });

    const subDirs = files.filter(file => file.isDirectory());
    const subDirPromises = subDirs.map(subDir => getJsFilesRecursive(path.join(dirname, subDir.name)));

    const subDirFiles = await Promise.all(subDirPromises);

    return jsFiles.concat(...subDirFiles);
}

/**
 * Type guard to check if an imported module has a default function export.
 * @param {unknown} imported
 * @returns {boolean}
 */
function hasDefaultFunction(imported: unknown): imported is { default: (...args: unknown[]) => unknown } {
    return (
        typeof imported === "object" &&
        imported !== null &&
        "default" in imported &&
        typeof (imported as { default: unknown }).default === "function"
    );
}

/**
 * Dynamically loads and invokes all route modules in a directory.
 * @param {string} loadPath - The directory to load routes from.
 * @param {...unknown} otherArgs - Arguments to pass to each route module's default export.
 */
async function loadRoutes(loadPath: string, ...otherArgs: unknown[]) {
    const files = await getJsFilesRecursive(loadPath);
    await Promise.all(
        files.map(async file => {
            // Convert file path to a relative path for import
            const filePath = path.relative("src/middleware", file) + ".js";
            const unixFilePath = filePath.split(path.sep).join("/");

            const imported = (await import(unixFilePath)) as unknown;

            if (hasDefaultFunction(imported)) {
                imported.default(...otherArgs);
            }
        }),
    );
}

export default loadRoutes;
