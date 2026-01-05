#!/usr/bin/env node

(async () => {
    const argv = process.argv.slice(2);

    if (argv[0] === "add-db") {
        await require("./lib/addDB")();
        return;
    }

    if (argv[0] === "add-route") {
        await require("./lib/addRoute")();
        return;
    }

    // ---- Your existing create-project code ----
    const path = require("path");
    const copyProject = require('./lib/copyProject');
    const { runInstall, installDBDriver, normalizePath } = require("./lib/utils");  // ADD normalizePath HERE
    const setupMainDB = require("./lib/setupMainDB");
    const setupExtraDB = require("./lib/setupExtraDB");
    const testDBConnection = require("./lib/testDBConnection");
    const { mainPrompts, extraDBPrompts } = require("./lib/prompts");

    const fs = require("fs-extra");


    // Resolve template folder dynamically
    let templateDir;

    // Try __dirname first (works for local/dev)
    const localTemplate = normalizePath(path.resolve(__dirname, "template"));  // NORMALIZE
    console.log("🔍 Checking local template:", localTemplate);

    if (fs.existsSync(localTemplate)) {
        templateDir = localTemplate;
        console.log("✅ Found local template");
    } else {
        // Fallback for npx (temp folder)
        try {
            const pkg = require.resolve("create-fullstack-boilerplate/package.json");
            templateDir = normalizePath(path.resolve(path.dirname(pkg), "template"));  // NORMALIZE
            console.log("✅ Found npm template:", templateDir);
        } catch (err) {
            console.error("❌ Could not resolve package:", err.message);
        }
    }

    if (!templateDir || !fs.existsSync(templateDir)) {
        throw new Error(
            `Template folder not found!\nSearched: ${localTemplate}\nMake sure 'template' is included in package.json 'files' field.`
        );
    }

    console.log("✅ Using template folder:", templateDir);

    console.log("=== DEBUG INFO ===");
    console.log("Current directory:", process.cwd());
    console.log("Template directory:", templateDir);
    console.log("Template exists:", fs.existsSync(templateDir));
    if (fs.existsSync(templateDir)) {
        console.log("Template contents:", fs.readdirSync(templateDir));
    }
    console.log("==================");


    try {
        console.log("\n🎛️  Setting Up Full Stack Project...\n");

        const answers = await mainPrompts();
        const targetDir = normalizePath(path.join(process.cwd(), answers.projectName));  // NORMALIZE

        console.log("Target directory:", targetDir);

        // Remove the IIFE wrapper and just await directly
        try {
            console.log("📁 Copying project files...");
            await copyProject(templateDir, targetDir);
            console.log("✅ Project copied successfully");
        } catch (err) {
            console.error("❌ Failed to copy project files:", err.message);
            throw err; // Re-throw to stop execution
        }

        await setupMainDB(targetDir, answers.dbDialect);
        console.log("➡️ Installing backend dependencies...");
        await runInstall(normalizePath(path.join(targetDir, "Backend")));  // NORMALIZE

        console.log("➡️ Installing frontend dependencies...");
        await runInstall(normalizePath(path.join(targetDir, "Frontend")));  // NORMALIZE

        console.log("➡️ Installing Your Db Dialect: ", answers.dbDialect);
        await installDBDriver(normalizePath(path.join(targetDir, "Backend")), answers.dbDialect);  // NORMALIZE


        if (answers.addExtraDB) {
            const extraDB = await extraDBPrompts();
            console.log(`\n🔍 Testing connection for ${extraDB.dbKey}...`);
            await installDBDriver(normalizePath(path.join(targetDir, "Backend")), extraDB.dialect);  // NORMALIZE
            const ok = await testDBConnection(targetDir, extraDB);

            if (ok) {
                await setupExtraDB(targetDir, extraDB);
                console.log(`✅ Extra DB '${extraDB.dbKey}' successfully integrated.\n`);
            } else {
                console.log(`⚠️ Connection failed. Skipping extra DB setup.\n`);
            }
        }

        if (answers.initGit) {
            try {
                const execa = require("execa").execa || require("execa");
                await execa("git", ["init"], { cwd: targetDir });
                if (answers.remoteRepo) {
                    await execa("git", ["remote", "add", "origin", answers.remoteRepo], { cwd: targetDir });
                }
                console.log("✅ Git initialized.\n");
            } catch (gitErr) {
                console.log(`⚠️ Git initialization failed: ${gitErr.message}`);
                console.log(`   You can initialize git manually later.\n`);
            }
        }

        console.log(`\n🎉 Project Ready!`);
        console.log(`\n➡️ Next Steps:`);
        console.log(`   cd ${answers.projectName}`);
        console.log(`   cd backend && npm run dev`);
        console.log(`   cd ../frontend && npm run dev\n`);
    } catch (err) {
        console.error(`\n❌ Error creating project: ${err.message}\n`);
        if (err.stack && process.env.DEBUG) {
            console.error(err.stack);
        }
        process.exit(1);
    }
})();



// #!/usr/bin/env node

// (async () => {
//     const argv = process.argv.slice(2);

//     if (argv[0] === "add-db") {
//         await require("./lib/addDB")();
//         return;
//     }

//     if (argv[0] === "add-route") {
//         await require("./lib/addRoute")();
//         return;
//     }

//     // ---- Your existing create-project code ----
//     const path = require("path");
//     // const { ensure } = require("./lib/utils");
//     const copyProject = require('./lib/copyProject')
//     const { runInstall, installDBDriver } = require("./lib/utils");
//     const setupMainDB = require("./lib/setupMainDB");
//     const setupExtraDB = require("./lib/setupExtraDB");
//     const testDBConnection = require("./lib/testDBConnection");
//     const { mainPrompts, extraDBPrompts } = require("./lib/prompts");

//     const fs = require("fs-extra");


//     // Resolve template folder dynamically
//     let templateDir;

//     // Try __dirname first (works for local/dev)
//     const localTemplate = path.resolve(__dirname, "template");
//     console.log("🔍 Checking local template:", localTemplate);

//     if (fs.existsSync(localTemplate)) {
//         templateDir = localTemplate;
//         console.log("✅ Found local template");
//     } else {
//         // Fallback for npx (temp folder)
//         try {
//             const pkg = require.resolve("create-fullstack-boilerplate/package.json");
//             templateDir = path.resolve(path.dirname(pkg), "template");
//             console.log("✅ Found npm template:", templateDir);
//         } catch (err) {
//             console.error("❌ Could not resolve package:", err.message);
//         }
//     }

//     if (!templateDir || !fs.existsSync(templateDir)) {
//         throw new Error(
//             `Template folder not found!\nSearched: ${localTemplate}\nMake sure 'template' is included in package.json 'files' field.`
//         );
//     }

//     console.log("✅ Using template folder:", templateDir);

//     console.log("=== DEBUG INFO ===");
//     console.log("Current directory:", process.cwd());
//     console.log("Template directory:", templateDir);
//     console.log("Template exists:", fs.existsSync(templateDir));
//     if (fs.existsSync(templateDir)) {
//         console.log("Template contents:", fs.readdirSync(templateDir));
//     }
//     console.log("==================");


//     try {
//         console.log("\n🎛️  Setting Up Full Stack Project...\n");

//         const answers = await mainPrompts();
//         const targetDir = path.join(process.cwd(), answers.projectName);

//         console.log("Target directory:", targetDir);

//         // Remove the IIFE wrapper and just await directly
//         try {
//             console.log("📁 Copying project files...");
//             await copyProject(templateDir, targetDir);
//             console.log("✅ Project copied successfully");
//         } catch (err) {
//             console.error("❌ Failed to copy project files:", err.message);
//             throw err; // Re-throw to stop execution
//         }

//         await setupMainDB(targetDir, answers.dbDialect);
//         console.log("➡️ Installing backend dependencies...");
//         await runInstall(path.join(targetDir, "Backend"));

//         console.log("➡️ Installing frontend dependencies...");
//         await runInstall(path.join(targetDir, "Frontend"));

//         console.log("➡️ Installing Your Db Dialect: ", answers.dbDialect)
//         await installDBDriver(path.join(targetDir, "Backend"), answers.dbDialect);


//         if (answers.addExtraDB) {
//             const extraDB = await extraDBPrompts();
//             console.log(`\n🔍 Testing connection for ${extraDB.dbKey}...`);
//             await installDBDriver(path.join(targetDir, "Backend"), extraDB.dialect);
//             const ok = await testDBConnection(targetDir, extraDB);

//             if (ok) {
//                 await setupExtraDB(targetDir, extraDB);
//                 console.log(`✅ Extra DB '${extraDB.dbKey}' successfully integrated.\n`);
//             } else {
//                 console.log(`⚠️ Connection failed. Skipping extra DB setup.\n`);
//             }
//         }

//         if (answers.initGit) {
//             try {
//                 const execa = require("execa").execa || require("execa");
//                 await execa("git", ["init"], { cwd: targetDir });
//                 if (answers.remoteRepo) {
//                     await execa("git", ["remote", "add", "origin", answers.remoteRepo], { cwd: targetDir });
//                 }
//                 console.log("✅ Git initialized.\n");
//             } catch (gitErr) {
//                 console.log(`⚠️ Git initialization failed: ${gitErr.message}`);
//                 console.log(`   You can initialize git manually later.\n`);
//             }
//         }

//         console.log(`\n🎉 Project Ready!`);
//         console.log(`\n➡️ Next Steps:`);
//         console.log(`   cd ${answers.projectName}`);
//         console.log(`   cd backend && npm run dev`);
//         console.log(`   cd ../frontend && npm run dev\n`);
//     } catch (err) {
//         console.error(`\n❌ Error creating project: ${err.message}\n`);
//         if (err.stack && process.env.DEBUG) {
//             console.error(err.stack);
//         }
//         process.exit(1);
//     }
// })();