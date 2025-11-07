const execa = require("execa");
const path = require("path");
const { log } = require("./utils");

module.exports = async function installDeps(targetDir) {
    log("Installing backend dependencies...");
    await execa("npm", ["install"], { cwd: path.join(targetDir, "backend"), stdio: "inherit" });

    log("Installing frontend dependencies...");
    await execa("npm", ["install"], { cwd: path.join(targetDir, "frontend"), stdio: "inherit" });
};
