'use strict';

require('dotenv').config();

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/sequelize.json')[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = require('./users')(sequelize, Sequelize);
db.Challenges = require('./challenges')(sequelize, Sequelize);
db.Reports = require('./reports')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);
db.Charities = require('./charities')(sequelize, Sequelize);

db.Users.hasMany(db.Challenges, { foreignKey: 'challenger', sourceKey: 'id' });
db.Challenges.belongsTo(db.Users, {
  foreignKey: 'challenger',
  targetKey: 'id',
});

module.exports = db;
