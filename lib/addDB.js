const path = require("path");
const { extraDBPrompts } = require("./prompts");
const testDBConnection = require("./testDBConnection");
const setupExtraDB = require("./setupExtraDB");
// const { ensure } = require("./utils");
// const fs = ensure("fs-extra");
const fs = require("fs-extra");


module.exports = async function addDB() {
    console.log(`\n➕ Add New Database to Existing Project\n`);

    const targetDir = process.cwd();
    const backendDir = path.join(targetDir, "Backend");
    const dbDir = path.join(backendDir, "DB");
    const modelsDir = path.join(backendDir, "Models");

    // Check if we're in a valid project
    if (!await fs.pathExists(backendDir)) {
        console.log(`❌ Error: No backend folder found. Are you in a project root directory?`);
        console.log(`   Run this command from your project root (where backend/ folder exists).`);
        return;
    }

    if (!await fs.pathExists(dbDir)) {
        console.log(`❌ Error: No DB folder found in backend. This doesn't appear to be a valid project.`);
        return;
    }

    if (!await fs.pathExists(modelsDir)) {
        console.log(`❌ Error: No Models folder found in backend. This doesn't appear to be a valid project.`);
        return;
    }

    try {
        // Ask DB info
        const extraDB = await extraDBPrompts();

        // Check if DB with same key already exists
        const dbConfigsPath = path.join(dbDir, "dbConfigs.js");
        if (await fs.pathExists(dbConfigsPath)) {
            const dbConfigsContent = await fs.readFile(dbConfigsPath, "utf8");
            if (dbConfigsContent.includes(`key: "${extraDB.dbKey}"`)) {
                console.log(`\n⚠️  Database with key '${extraDB.dbKey}' already exists in the project.`);
                console.log(`   Please use a different DB identifier.\n`);
                return;
            }
        }

        // Check if DB folder already exists
        const dbFolder = path.join(modelsDir, extraDB.dbKey);
        if (await fs.pathExists(dbFolder)) {
            console.log(`\n⚠️  Folder '${extraDB.dbKey}' already exists in Models directory.`);
            console.log(`   Please use a different DB identifier.\n`);
            return;
        }

        console.log(`\n🔍 Testing connection for ${extraDB.dbKey}...\n`);
        const ok = await testDBConnection(targetDir, extraDB);

        if (!ok) {
            console.log(`❌ Connection failed. DB not added.\n`);
            return;
        }

        await setupExtraDB(targetDir, extraDB);
        console.log(`\n✅ Successfully added ${extraDB.dbKey} to project.\n`);
        console.log(`📝 Next steps:`);
        console.log(`   1. Check backend/.env for database credentials`);
        console.log(`   2. Add more models in backend/Models/${extraDB.dbKey}/`);
        console.log(`   3. Import and use in your routes: const { ${extraDB.dbKey} } = require('./Models');\n`);

    } catch (err) {
        console.log(`\n❌ Error adding DB:`, err.message);
        if (err.stack) {
            console.log(`\nStack trace:`, err.stack);
        }
    }
};
