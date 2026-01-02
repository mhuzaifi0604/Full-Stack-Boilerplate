const { log } = require("./utils");
const fs = require("fs-extra");
const path = require("path");

module.exports = async function copyProject(src, dest) {
    // Resolve absolute paths
    const resolvedSrc = path.resolve(src);
    const resolvedDest = path.resolve(dest);
    
    // Check if destination already exists
    if (await fs.pathExists(resolvedDest)) {
        throw new Error(`Directory '${path.basename(resolvedDest)}' already exists. Please choose a different project name.`);
    }

    // Check if source template exists
    if (!await fs.pathExists(resolvedSrc)) {
        throw new Error(`Template directory not found at: ${resolvedSrc}`);
    }
    
    // Verify backend exists in source
    const srcBackend = path.join(resolvedSrc, "backend");
    if (!await fs.pathExists(srcBackend)) {
        throw new Error(`Template is missing backend folder at: ${srcBackend}`);
    }

    log("Creating project directory...");
    
    try {
        // Create destination directory
        await fs.ensureDir(resolvedDest);
        
        // Copy backend
        console.log("Copying backend...");
        await fs.copy(
            path.join(resolvedSrc, "backend"), 
            path.join(resolvedDest, "backend"),
            { filter: (src) => !src.includes("node_modules") }
        );
        
        // Copy frontend
        console.log("Copying frontend...");
        await fs.copy(
            path.join(resolvedSrc, "frontend"), 
            path.join(resolvedDest, "frontend"),
            { filter: (src) => !src.includes("node_modules") }
        );
        
        // Copy root files if any (like .gitignore, README, etc.)
        const rootFiles = await fs.readdir(resolvedSrc);
        for (const file of rootFiles) {
            const srcPath = path.join(resolvedSrc, file);
            const stat = await fs.stat(srcPath);
            if (stat.isFile()) {
                await fs.copy(srcPath, path.join(resolvedDest, file));
            }
        }
        
        // Verify the copy was successful
        const backendPath = path.join(resolvedDest, "backend");
        const frontendPath = path.join(resolvedDest, "frontend");
        
        if (!await fs.pathExists(backendPath)) {
            throw new Error(`Backend folder not copied to: ${backendPath}`);
        }
        
        if (!await fs.pathExists(frontendPath)) {
            throw new Error(`Frontend folder not copied to: ${frontendPath}`);
        }
        
        console.log("✅ Files copied successfully.");
    } catch (err) {
        // Clean up on failure
        try {
            await fs.remove(resolvedDest);
        } catch (cleanupErr) {
            // Ignore cleanup errors
        }
        throw new Error(`Failed to copy project files: ${err.message}`);
    }
};
