const { replaceInFiles, log } = require("./utils");

module.exports = async function setupMainDB(targetDir, dialect) {
    log("Configuring main DB in backend...");
    await replaceInFiles(targetDir, {
        "__DB_DIALECT__": dialect
    });
    console.log("✅ Main DB configured.");
};
