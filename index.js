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
    // const { ensure } = require("./lib/utils");
    const copyProject = require("./lib/copyProject");
    const { runInstall, installDBDriver } = require("./lib/utils");
    const setupMainDB = require("./lib/setupMainDB");
    const setupExtraDB = require("./lib/setupExtraDB");
    const testDBConnection = require("./lib/testDBConnection");
    const { mainPrompts, extraDBPrompts } = require("./lib/prompts");

    const fs = require("fs-extra");


    // Resolve template folder dynamically
    let templateDir;

    // Try __dirname first (works for local/dev)
    const localTemplate = path.join(__dirname, "template");
    if (fs.existsSync(localTemplate)) {
        templateDir = localTemplate;
    } else {
        // Fallback for npx (temp folder)
        const pkg = require.resolve("create-fullstack-boilerplate/package.json");
        templateDir = path.join(path.dirname(pkg), "template");
    }

    if (!fs.existsSync(templateDir)) {
        throw new Error(
            "Template folder not found! Make sure it is included in package.json 'files' and published."
        );
    }

    console.log("Using template folder:", templateDir);


    try {
        console.log("\n🎛️  Setting Up Full Stack Project...\n");

        const answers = await mainPrompts();
        // const templateDir = path.join(__dirname, "template");
        const targetDir = path.join(process.cwd(), answers.projectName);

        (async () => {

            try {
                await copyProject(templateDir, targetDir);
                console.log("✅ Project copied successfully");
            } catch (err) {
                console.error("❌ Failed to copy project files:", err.message);
            }
        })();

        await setupMainDB(targetDir, answers.dbDialect);
        console.log("➡️ Installing backend dependencies...");
        await runInstall(path.join(targetDir, "Backend"));

        console.log("➡️ Installing frontend dependencies...");
        await runInstall(path.join(targetDir, "Frontend"));

        console.log("➡️ Installing Your Db Dialect: ", answers.dbDialect)
        await installDBDriver(path.join(targetDir, "Backend"), answers.dbDialect);


        if (answers.addExtraDB) {
            const extraDB = await extraDBPrompts();
            console.log(`\n🔍 Testing connection for ${extraDB.dbKey}...`);
            await installDBDriver(path.join(targetDir, "Backend"), extraDB.dialect);
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
