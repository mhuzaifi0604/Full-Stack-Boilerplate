const path = require("path");

async function testDBConnection(targetDir, dbConfig) {
    const sequelizePath = path.join(targetDir, "backend", "node_modules", "sequelize");
    const { Sequelize } = require(sequelizePath);

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
