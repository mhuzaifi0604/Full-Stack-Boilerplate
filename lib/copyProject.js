const { log } = require("./utils");
// const fs = ensure("fs-extra");
const fs = require("fs-extra");

const path = require("path");

module.exports = async function copyProject(src, dest) {
    // Check if destination already exists
    if (await fs.pathExists(dest)) {
        throw new Error(`Directory '${path.basename(dest)}' already exists. Please choose a different project name.`);
    }

    // Check if source template exists
    if (!await fs.pathExists(src)) {
        throw new Error(`Template directory not found. Package may be corrupted.`);
    }

    log("Creating project directory...");
    try {
        await fs.copy(src, dest, {
            filter: (item) => !item.includes("node_modules")
        });
        console.log("✅ Files copied successfully.");
    } catch (err) {
        throw new Error(`Failed to copy project files: ${err.message}`);
    }
};
