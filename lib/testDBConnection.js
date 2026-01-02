// const path = require("path");

// async function testDBConnection(targetDir, dbConfig) {
//     const sequelizePath = path.join(targetDir, "backend", "node_modules", "sequelize");
//     const { Sequelize } = require(sequelizePath);

//     const sequelize = new Sequelize(
//         dbConfig.database,
//         dbConfig.username,
//         dbConfig.password,
//         {
//             host: dbConfig.host,
//             port: dbConfig.port,
//             dialect: dbConfig.dialect,
//             logging: false
//         }
//     );

//     try {
//         await sequelize.authenticate();
//         console.log(`✅ Connection successful to ${dbConfig.dbKey}`);
//         await sequelize.close();
//         return true;
//     } catch (err) {
//         console.log(`❌ Failed to connect to ${dbConfig.dbKey}`);
//         console.log("Error:", err.message);
//         return false;
//     }
// }

// module.exports = testDBConnection;



const path = require("path");
const { assertDependency } = require("./utils"); 

async function testDBConnection(targetDir, dbConfig) {
    const backendDir = path.join(targetDir, "Backend");

    let driver;
    try {
        if (dbConfig.dialect === "mysql") {
            driver = assertDependency("mysql2", backendDir);
        }
        if (dbConfig.dialect === "mariadb") {
            driver = assertDependency("mariadb", backendDir);
        }
        if (dbConfig.dialect === "postgres") {
            driver = assertDependency("pg", backendDir);
        }

    } catch (e) {
        throw new Error(
            `Database driver for '${dbConfig.dialect}' not found. ` +
            `Please install it in backend (e.g. npm install ${dbConfig.dialect === "postgres" ? "pg" : dbConfig.dialect}).`
        );
    }

    // const { Sequelize } = require(
    //     path.join(backendDir, "node_modules", "sequelize")
    // );
    const { Sequelize } = assertDependency("sequelize", backendDir);

    const sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            logging: false
        }
    );

    try {
        await sequelize.authenticate();
        console.log(`✅ Connection successful to ${dbConfig.dbKey}`);
        await sequelize.close();
        return true;
    } catch (err) {
        console.log(`❌ Failed to connect to ${dbConfig.dbKey}`);
        console.log("Error:", err.message);
        return false;
    }
}

module.exports = testDBConnection;
