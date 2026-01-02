const path = require("path");
const fs = require("fs-extra");

module.exports = async function copyProject(src, dest) {
    await fs.copy(path.resolve(src), path.resolve(dest), {
        overwrite: false,
        errorOnExist: true,
        filter: (srcPath) => !srcPath.includes("node_modules")
    });
    console.log("✅ Files copied successfully.");
}

