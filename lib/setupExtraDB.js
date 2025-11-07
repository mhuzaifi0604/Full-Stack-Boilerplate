const path = require("path");
const { ensure } = require("./utils");
const fs = ensure("fs-extra");

module.exports = async function setupExtraDB(targetDir, dbConfig) {
    const backendDir = path.join(targetDir, "backend");
    const modelsDir = path.join(backendDir, "Models");
    const dbDir = path.join(backendDir, "DB");

    // 1. Create folder for this DB's models
    const dbFolderName = dbConfig.dbKey;
    const dbModelsFolder = path.join(modelsDir, dbFolderName);
    await fs.ensureDir(dbModelsFolder);

    // 2. Create config file for this DB
    const configFileName = `${dbFolderName}.config.js`;
    const configPath = path.join(dbDir, configFileName);
    
    const configContent = `module.exports = {
  development: {
    username: process.env.${dbConfig.dbKey}_USER || "${dbConfig.username}",
    password: process.env.${dbConfig.dbKey}_PASSWORD || "${dbConfig.password}",
    database: process.env.${dbConfig.dbKey}_NAME || "${dbConfig.database}",
    host: process.env.${dbConfig.dbKey}_HOST || "${dbConfig.host}",
    port: process.env.${dbConfig.dbKey}_PORT || ${dbConfig.port},
    dialect: "${dbConfig.dialect}"
  },
  test: {
    username: process.env.${dbConfig.dbKey}_USER || "${dbConfig.username}",
    password: process.env.${dbConfig.dbKey}_PASSWORD || "${dbConfig.password}",
    database: process.env.${dbConfig.dbKey}_NAME || "${dbConfig.database}",
    host: process.env.${dbConfig.dbKey}_HOST || "${dbConfig.host}",
    port: process.env.${dbConfig.dbKey}_PORT || ${dbConfig.port},
    dialect: "${dbConfig.dialect}"
  },
  production: {
    username: process.env.${dbConfig.dbKey}_USER,
    password: process.env.${dbConfig.dbKey}_PASSWORD,
    database: process.env.${dbConfig.dbKey}_NAME,
    host: process.env.${dbConfig.dbKey}_HOST,
    port: process.env.${dbConfig.dbKey}_PORT,
    dialect: "${dbConfig.dialect}"
  }
};
`;

    await fs.writeFile(configPath, configContent);

    // 3. Create a sample model file
    const modelContent = generateModelContent(dbConfig);
    const modelFileName = `${dbConfig.tableName}.js`;
    const modelPath = path.join(dbModelsFolder, modelFileName);
    await fs.writeFile(modelPath, modelContent);

    // 4. Update dbConfigs.js to register this DB
    const dbConfigsPath = path.join(dbDir, "dbConfigs.js");
    let dbConfigsContent = await fs.readFile(dbConfigsPath, "utf8");
    
    const newEntry = `  {
    key: "${dbConfig.dbKey}",
    folder: "${dbConfig.dbKey}",
    configPath: "/../DB/${configFileName}"
  }`;

    // Insert before the closing bracket
    dbConfigsContent = dbConfigsContent.replace(
        /const dbConfigs = \[\s*\];/,
        `const dbConfigs = [
${newEntry}
];`
    );

    // If there are already entries, append
    if (!dbConfigsContent.includes(newEntry) && dbConfigsContent.includes("const dbConfigs = [")) {
        dbConfigsContent = dbConfigsContent.replace(
            /(const dbConfigs = \[[\s\S]*?)(\];)/,
            `$1,
${newEntry}
$2`
        );
    }

    await fs.writeFile(dbConfigsPath, dbConfigsContent);

    // 5. Update .env file with DB credentials
    const envPath = path.join(backendDir, ".env");
    let envContent = await fs.readFile(envPath, "utf8");
    
    const envVars = `\n# ${dbConfig.dbKey} Database Configuration\n${dbConfig.dbKey}_USER=${dbConfig.username}\n${dbConfig.dbKey}_PASSWORD=${dbConfig.password}\n${dbConfig.dbKey}_NAME=${dbConfig.database}\n${dbConfig.dbKey}_HOST=${dbConfig.host}\n${dbConfig.dbKey}_PORT=${dbConfig.port}\n`;
    
    if (!envContent.includes(`${dbConfig.dbKey}_USER`)) {
        envContent += envVars;
        await fs.writeFile(envPath, envContent);
    }

    console.log(`✅ Database '${dbConfig.dbKey}' configured successfully.`);
};

function generateModelContent(dbConfig) {
    const modelName = dbConfig.tableName.charAt(0).toUpperCase() + dbConfig.tableName.slice(1);
    
    // Generate model content based on whether attributes were provided
    if (dbConfig.attributes && dbConfig.attributes.length > 0) {
        const attributesStr = dbConfig.attributes.map(attr => {
            let attrDef = `    ${attr.name}: {\n      type: DataTypes.${attr.type}`;
            
            if (attr.length) {
                attrDef += `(${attr.length})`;
            }
            
            if (attr.primaryKey) {
                attrDef += `,\n      primaryKey: true,\n      autoIncrement: true`;
            }
            
            if (attr.allowNull === false) {
                attrDef += `,\n      allowNull: false`;
            }
            
            if (attr.unique) {
                attrDef += `,\n      unique: true`;
            }
            
            if (attr.defaultValue !== undefined) {
                attrDef += `,\n      defaultValue: ${JSON.stringify(attr.defaultValue)}`;
            }
            
            attrDef += `\n    }`;
            return attrDef;
        }).join(',\n');

        return `'use strict';
module.exports = (sequelize, DataTypes) => {
  const ${modelName} = sequelize.define('${modelName}', {
${attributesStr}
  }, {
    tableName: '${dbConfig.tableName}',
    timestamps: true
  });

  ${modelName}.associate = function(models) {
    // Define associations here
    // Example: ${modelName}.belongsTo(models.OtherModel, { foreignKey: 'otherId' });
  };

  return ${modelName};
};
`;
    } else {
        // Simple model with just ID
        return `'use strict';
module.exports = (sequelize, DataTypes) => {
  const ${modelName} = sequelize.define('${modelName}', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: '${dbConfig.tableName}',
    timestamps: true
  });

  ${modelName}.associate = function(models) {
    // Define associations here
    // Example: ${modelName}.belongsTo(models.OtherModel, { foreignKey: 'otherId' });
  };

  return ${modelName};
};
`;
    }
}
