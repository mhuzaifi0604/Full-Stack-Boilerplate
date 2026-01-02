const { log } = require("./utils");
const fs = require("fs-extra");
const path = require("path");

module.exports = async function copyProject(src, dest) {
    // Check if destination already exists
    if (await fs.pathExists(dest)) {
        throw new Error(`Directory '${path.basename(dest)}' already exists. Please choose a different project name.`);
    }

    // Check if source template exists
    if (!await fs.pathExists(src)) {
        throw new Error(`Template directory not found at: ${src}`);
    }

    log("Creating project directory...");
    
    try {
        // Copy entire template directory (Backend and Frontend folders will be copied with their exact names)
        await fs.copy(src, dest, {
            filter: (srcPath) => {
                // Filter out node_modules
                return !srcPath.includes("node_modules");
            }
        });
        
        console.log("✅ Files copied successfully.");
    } catch (err) {
        // Clean up on failure
        try {
            await fs.remove(dest);
        } catch (cleanupErr) {
            // Ignore cleanup errors
        }
        throw new Error(`Failed to copy project files: ${err.message}`);
    }
};
