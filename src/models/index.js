const Sequelize = require('sequelize');
const { dbConfig } = require('../../config');

const { database, username, password } = dbConfig;

const sequelize = new Sequelize(database, username, password, dbConfig);

const db = { sequelize, Sequelize };

db.Users = require('./users')(sequelize, Sequelize);
db.Challenges = require('./challenges')(sequelize, Sequelize);
db.Reports = require('./reports')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);
db.Charities = require('./charities')(sequelize, Sequelize);

db.Users.hasMany(db.Challenges, { foreignKey: 'userId', sourceKey: 'id' });
db.Challenges.belongsTo(db.Users, {
  foreignKey: 'userId',
  targetKey: 'id',
});

db.Users.hasMany(db.Challenges, { foreignKey: 'refereeId', sourceKey: 'id' });
db.Challenges.belongsTo(db.Users, {
  foreignKey: 'refereeId',
  targetKey: 'id',
});

db.Charities.hasMany(db.Challenges, {
  foreignKey: 'receipient_charity_id',
  sourceKey: 'id',
});
db.Challenges.belongsTo(db.Charities, {
  foreignKey: 'receipient_user_id',
  targetKey: 'id',
});

db.Challenges.hasMany(db.Reports, {
  foreignKey: 'challengeId',
  sourceKey: 'id',
});
db.Reports.belongsTo(db.Challenges, {
  foreignKey: 'challengeId',
  targetKey: 'id',
});

db.Challenges.hasOne(db.Review, { foreignKey: 'challenge_id' });

module.exports = db;
