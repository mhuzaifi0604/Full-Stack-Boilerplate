const path = require("path");
const fs = require("fs-extra");
const { normalizePath } = require("./utils");  // IMPORT THIS

module.exports = async function copyProject(src, dest) {
    try {
        // Use normalizePath for consistent path handling
        const resolvedSrc = normalizePath(path.resolve(src));
        const resolvedDest = normalizePath(path.resolve(dest));

        if (!await fs.pathExists(resolvedSrc)) {
            throw new Error(`Source template directory not found: ${resolvedSrc}`);
        }

        if (await fs.pathExists(resolvedDest)) {
            throw new Error(`Destination directory already exists: ${resolvedDest}`);
        }

        console.log(`📁 Copying from: ${resolvedSrc}`);
        console.log(`📁 Copying to: ${resolvedDest}`);

        await fs.copy(resolvedSrc, resolvedDest, {
            overwrite: false,
            errorOnExist: false,
            filter: (srcPath) => {
                const normalizedPath = normalizePath(srcPath);  // NORMALIZE HERE TOO
                const shouldCopy = !normalizedPath.includes("node_modules");
                return shouldCopy;
            }
        });

        // Verify the copy was successful
        if (!await fs.pathExists(resolvedDest)) {
            throw new Error("Copy operation completed but destination directory not found");
        }

        console.log("✅ Files copied successfully.");
    } catch (err) {
        console.error("❌ Copy operation failed:", err.message);
        throw err;
    }
}