const { log } = require("./utils");
// const fs = require("fs-extra"); // remove this line
const cpy = require("cpy"); // add this
const path = require("path");
const fs = require("fs-extra"); // still needed for pathExists/remove

module.exports = async function copyProject(src, dest) {
    if (await fs.pathExists(dest)) {
        throw new Error(`Directory '${path.basename(dest)}' already exists. Please choose a different project name.`);
    }

    if (!await fs.pathExists(src)) {
        throw new Error(`Template directory not found at: ${src}`);
    }

    log("Creating project directory...");

    try {
        // Use cpy instead of fs.copy
        await cpy("**/*", dest, {
            cwd: src,
            parents: true,
            filter: (srcPath) => !srcPath.includes("node_modules")
        });

        console.log("✅ Files copied successfully.");
    } catch (err) {
        try {
            await fs.remove(dest);
        } catch (_) { }
        throw new Error(`Failed to copy project files: ${err.message}`);
    }
};
