const { log } = require("./utils");
const fs = require("fs-extra");
const path = require("path");

module.exports = async function copyProject(src, dest) {
    // Normalize paths to handle Windows paths with spaces
    const normalizedSrc = path.normalize(src);
    const normalizedDest = path.normalize(dest);
    
    // Check if destination already exists
    if (await fs.pathExists(normalizedDest)) {
        throw new Error(`Directory '${path.basename(normalizedDest)}' already exists. Please choose a different project name.`);
    }

    // Check if source template exists
    if (!await fs.pathExists(normalizedSrc)) {
        throw new Error(`Template directory not found at: ${normalizedSrc}`);
    }

    log("Creating project directory...");
    
    try {
        // Ensure destination directory exists first
        await fs.ensureDir(normalizedDest);
        
        // Copy with error handling
        await fs.copy(normalizedSrc, normalizedDest, {
            overwrite: false,
            errorOnExist: false,
            filter: (item) => {
                // Filter out node_modules
                return !item.includes("node_modules");
            }
        });
        
        // Verify the copy was successful by checking if backend exists
        const backendPath = path.join(normalizedDest, "backend");
        if (!await fs.pathExists(backendPath)) {
            throw new Error(`Copy verification failed: backend folder not found at ${backendPath}`);
        }
        
        console.log("✅ Files copied successfully.");
    } catch (err) {
        // Clean up on failure
        try {
            await fs.remove(normalizedDest);
        } catch (cleanupErr) {
            // Ignore cleanup errors
        }
        throw new Error(`Failed to copy project files: ${err.message}`);
    }
};
