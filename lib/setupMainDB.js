const { replaceInFiles, log } = require("./utils");
const path = require("path");

module.exports = async function setupMainDB(targetDir, dialect) {
    log("Configuring main DB in backend...");
    const backendDir = path.join(targetDir, "backend");
    await replaceInFiles(backendDir, {
        "__DB_DIALECT__": dialect
    });
    console.log("✅ Main DB configured.");
};
