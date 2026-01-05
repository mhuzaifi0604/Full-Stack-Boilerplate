const path = require("path");
const fs = require("fs-extra");
const { normalizePath } = require("./utils");

module.exports = async function copyProject(src, dest) {
    try {
        // Use path.resolve without normalizePath for fs operations
        const resolvedSrc = path.resolve(src);
        const resolvedDest = path.resolve(dest);

        console.log(`📁 Copying from: ${resolvedSrc}`);
        console.log(`📁 Copying to: ${resolvedDest}`);

        // Check source exists
        if (!await fs.pathExists(resolvedSrc)) {
            throw new Error(`Source template directory not found: ${resolvedSrc}`);
        }

        // Check if destination already exists
        if (await fs.pathExists(resolvedDest)) {
            throw new Error(`Destination directory already exists: ${resolvedDest}`);
        }

        // Perform the copy
        await fs.copy(resolvedSrc, resolvedDest, {
            overwrite: false,
            errorOnExist: false,
            filter: (srcPath) => {
                // Don't skip node_modules using includes, use a more reliable check
                const relativePath = path.relative(resolvedSrc, srcPath);
                const shouldCopy = !relativePath.split(path.sep).includes("node_modules");
                return shouldCopy;
            }
        });

        console.log("📁 Copy operation completed, verifying...");

        // Add a small delay to ensure filesystem sync (especially on Windows)
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify the copy was successful
        const destExists = await fs.pathExists(resolvedDest);
        console.log(`📁 Destination exists: ${destExists}`);

        if (!destExists) {
            throw new Error("Copy operation completed but destination directory not found");
        }

        // Verify contents were copied
        const destContents = await fs.readdir(resolvedDest);
        console.log(`📁 Destination contents: ${destContents.join(", ")}`);

        if (destContents.length === 0) {
            throw new Error("Destination directory is empty after copy");
        }

        console.log("✅ Files copied successfully.");
    } catch (err) {
        console.error("❌ Copy operation failed:", err.message);
        throw err;
    }
}