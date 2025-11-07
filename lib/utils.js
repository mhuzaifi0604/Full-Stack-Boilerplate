const { execSync } = require("child_process");

function ensure(dep) {
    try {
        return require(dep);
    } catch (e) {
        console.log(`📦 Installing missing dependency: ${dep}...`);
        execSync(`npm install ${dep} --silent`, { cwd: __dirname + "/..", stdio: "inherit" });
        return require(dep);
    }
}

function log(step) {
    console.log(`\n➡️  ${step}`);
}

const fs = ensure("fs-extra");
const path = require("path");

async function replaceInFiles(base, replacements) {
    const exts = [".js", ".ts", ".json", ".md", ".env", ".yml"];
    async function walk(dir) {
        for (const item of await fs.readdir(dir)) {
            const fullPath = path.join(dir, item);
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory()) await walk(fullPath);
            else if (exts.includes(path.extname(fullPath))) {
                let data = await fs.readFile(fullPath, "utf8");
                for (const [k, v] of Object.entries(replacements)) {
                    data = data.replaceAll(k, v);
                }
                await fs.writeFile(fullPath, data);
            }
        }
    }
    await walk(base);
}

module.exports = { ensure, log, replaceInFiles };
