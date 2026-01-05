// const fs = require("fs-extra");
// const path = require("path");
// const execa = require("execa");

// // ------------------ Logging ------------------
// function log(step) {
//     console.log(`\n➡️  ${step}`);
// }

// // ------------------ Replace in Files ------------------
// async function replaceInFiles(base, replacements) {
//     const exts = [".js", ".ts", ".json", ".md", ".env", ".yml"];

//     async function walk(dir) {
//         // Check if directory exists
//         if (!await fs.pathExists(dir)) {
//             console.warn(`Warning: Directory ${dir} does not exist, skipping...`);
//             return;
//         }

//         let items;
//         try {
//             items = await fs.readdir(dir);
//         } catch (err) {
//             console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
//             return;
//         }

//         for (const item of items) {
//             const fullPath = path.join(dir, item);
//             try {
//                 const stat = await fs.stat(fullPath);
//                 if (stat.isDirectory()) {
//                     await walk(fullPath);
//                 } else if (exts.includes(path.extname(fullPath))) {
//                     let data = await fs.readFile(fullPath, "utf8");
//                     for (const [k, v] of Object.entries(replacements)) {
//                         data = data.replaceAll(k, v);
//                     }
//                     await fs.writeFile(fullPath, data);
//                 }
//             } catch (err) {
//                 console.warn(`Warning: Error processing ${fullPath}: ${err.message}`);
//             }
//         }
//     }

//     await walk(base);
// }

// // ------------------ Ensure Directory ------------------
// async function ensureDir(dir) {
//     await fs.ensureDir(dir);
// }

// // ------------------ Assert Dependency ------------------
// function assertDependency(depName, cwd) {
//     try {
//         return require(path.join(cwd, "node_modules", depName));
//     } catch (err) {
//         throw new Error(
//             `Dependency '${depName}' is not installed in ${cwd}.\n` +
//             `Run: cd ${cwd} && npm install ${depName}`
//         );
//     }
// }

// // ------------------ Run npm install ------------------
// async function runInstall(cwd) {
//     // Normalize path for Windows
//     const normalizedCwd = path.normalize(cwd);

//     // Verify directory exists
//     if (!await fs.pathExists(normalizedCwd)) {
//         throw new Error(`Directory does not exist: ${normalizedCwd}`);
//     }

//     try {
//         await execa("npm", ["install"], {
//             cwd: normalizedCwd,
//             stdio: "inherit",
//             shell: true // Use shell for Windows compatibility
//         });
//     } catch (err) {
//         throw new Error(`npm install failed in ${normalizedCwd}: ${err.message}`);
//     }
// }

// // ------------------ Installing Dynamic DB Drivers ----------------

// async function installDBDriver(targetDir, dialect) {
//     let pkg;
//     if (dialect === "mariadb") pkg = "mariadb";
//     if (dialect === "mysql") pkg = "mysql2";
//     if (dialect === "postgres") pkg = "pg";
//     if (!pkg) return;

//     // Normalize path for Windows
//     const normalizedDir = path.normalize(targetDir);

//     console.log(`➡️ Installing ${pkg}...`);
//     try {
//         await execa("npm", ["install", pkg], { 
//             cwd: normalizedDir, 
//             stdio: "inherit",
//             shell: true // Use shell for Windows compatibility
//         });
//     } catch (err) {
//         console.warn(`Warning: Failed to install ${pkg}: ${err.message}`);
//     }
// }

// // Add this function to utils.js
// function normalizePath(p) {
//     return path.normalize(p).replace(/\\/g, '/');
// }


// module.exports = {
//     log,
//     replaceInFiles,
//     ensureDir,
//     assertDependency,
//     runInstall,
//     installDBDriver,
//     normalizePath
// };


const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

// ------------------ Logging ------------------
function log(step) {
    console.log(`\n➡️  ${step}`);
}

// ------------------ Normalize Path (Windows compatible) ------------------
function normalizePath(p) {
    return path.normalize(p).replace(/\\/g, '/');
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
    // Normalize path for Windows
    const normalizedCwd = path.normalize(cwd);

    // Verify directory exists
    if (!await fs.pathExists(normalizedCwd)) {
        throw new Error(`Directory does not exist: ${normalizedCwd}`);
    }

    try {
        await execa("npm", ["install"], {
            cwd: normalizedCwd,
            stdio: "inherit",
            shell: true // Use shell for Windows compatibility
        });
    } catch (err) {
        throw new Error(`npm install failed in ${normalizedCwd}: ${err.message}`);
    }
}

// ------------------ Installing Dynamic DB Drivers ----------------
async function installDBDriver(targetDir, dialect) {
    let pkg;
    if (dialect === "mariadb") pkg = "mariadb";
    if (dialect === "mysql") pkg = "mysql2";
    if (dialect === "postgres") pkg = "pg";
    if (!pkg) return;

    // Normalize path for Windows
    const normalizedDir = path.normalize(targetDir);

    console.log(`➡️ Installing ${pkg}...`);
    try {
        await execa("npm", ["install", pkg], {
            cwd: normalizedDir,
            stdio: "inherit",
            shell: true // Use shell for Windows compatibility
        });
    } catch (err) {
        console.warn(`Warning: Failed to install ${pkg}: ${err.message}`);
    }
}

module.exports = {
    log,
    replaceInFiles,
    ensureDir,
    assertDependency,
    runInstall,
    installDBDriver,
    normalizePath  // ADD THIS
};