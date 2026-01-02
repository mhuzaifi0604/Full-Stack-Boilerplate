// function ensure(dep) {
//     try {
//         return require(dep);
//     } catch (e) {
//         console.log(`📦 Installing missing dependency: ${dep}...`);
//         execSync(`npm install ${dep} --silent`, { cwd: __dirname + "/..", stdio: "inherit" });
//         return require(dep);
//     }
// }





const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

// ------------------ Logging ------------------
function log(step) {
    console.log(`\n➡️  ${step}`);
}

// ------------------ Replace in Files ------------------
async function replaceInFiles(base, replacements) {
    const exts = [".js", ".ts", ".json", ".md", ".env", ".yml"];

    async function walk(dir) {
        // Check if directory exists
        if (!await fs.pathExists(dir)) {
            console.warn(`Warning: Directory ${dir} does not exist, skipping...`);
            return;
        }

        let items;
        try {
            items = await fs.readdir(dir);
        } catch (err) {
            console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
            return;
        }

        for (const item of items) {
            const fullPath = path.join(dir, item);
            try {
                const stat = await fs.stat(fullPath);
                if (stat.isDirectory()) {
                    await walk(fullPath);
                } else if (exts.includes(path.extname(fullPath))) {
                    let data = await fs.readFile(fullPath, "utf8");
                    for (const [k, v] of Object.entries(replacements)) {
                        data = data.replaceAll(k, v);
                    }
                    await fs.writeFile(fullPath, data);
                }
            } catch (err) {
                console.warn(`Warning: Error processing ${fullPath}: ${err.message}`);
            }
        }
    }

    await walk(base);
}

// ------------------ Ensure Directory ------------------
async function ensureDir(dir) {
    await fs.ensureDir(dir);
}

// ------------------ Assert Dependency ------------------
function assertDependency(depName, cwd) {
    try {
        return require(path.join(cwd, "node_modules", depName));
    } catch (err) {
        throw new Error(
            `Dependency '${depName}' is not installed in ${cwd}.\n` +
            `Run: cd ${cwd} && npm install ${depName}`
        );
    }
}

// ------------------ Run npm install ------------------
async function runInstall(cwd) {
    await execa("npm", ["install"], {
        cwd,
        stdio: "inherit"
    });
}

// ------------------ Installing Dynamic DB Drivers ----------------

async function installDBDriver(targetDir, dialect) {
    let pkg;
    if (dialect === "mariadb") pkg = "mariadb";
    if (dialect === "mysql") pkg = "mysql2";
    if (dialect === "postgres") pkg = "pg";
    if (!pkg) return;

    console.log(`➡️ Installing ${pkg}...`);
    await execa("npm", ["install", pkg], { cwd: targetDir, stdio: "inherit" });
}


module.exports = {
    log,
    replaceInFiles,
    ensureDir,
    assertDependency,
    runInstall,
    installDBDriver
};
