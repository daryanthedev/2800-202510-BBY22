import fs from "fs/promises";
import path from "path";

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

function hasDefaultFunction(imported: unknown): imported is { default: (...args: unknown[]) => unknown } {
    return (
        typeof imported === "object" &&
        imported !== null &&
        "default" in imported &&
        typeof (imported as { default: unknown }).default === "function"
    );
}

async function loadRoutes(loadPath: string, ...otherArgs: unknown[]) {
    const files = await getJsFilesRecursive(loadPath);
    await Promise.all(
        files.map(async file => {
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
