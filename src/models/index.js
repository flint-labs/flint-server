const Sequelize = require('sequelize');
const { dbConfig } = require('../../config');

const { database, username, password } = dbConfig;

const sequelize = new Sequelize(
  database, username, password, dbConfig,
);

const db = { sequelize, Sequelize };

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
