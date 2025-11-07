'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfigs = require('../DB/dbConfigs')
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';


const databases = {};

for (const { key, folder, configPath } of dbConfigs) {
  const config = require(__dirname + configPath)[env];
  let sequelize;

  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.user, config.password, config);
  }

  const db = {};

  // Load regular models in CMPA folder (excluding operatorCmpaModel.js)
  fs.readdirSync(path.join(__dirname, folder))
    .filter(file =>
      file.indexOf('.') !== 0 &&
      file.slice(-3) === '.js' &&
      file !== basename &&
      !file.includes('.test.js')
    )
    .forEach(file => {
      const model = require(path.join(__dirname, folder, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });


  // Setup associations
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // Store under key (e.g., CRM_DB, CMPA_DB, etc.)
  databases[key] = db;
}

module.exports = databases;
