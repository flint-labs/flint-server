module.exports = (sequelize, DataTypes) => sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  email: {
    field: 'email',
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  nickname: {
    field: 'nickname',
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  password: {
    field: 'password',
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  gender: {
    field: 'gender',
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  birth: {
    field: 'birth',
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  location: {
    field: 'location',
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  change: {
    field: 'change',
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  pushToken: {
    field: 'pushToken',
    type: DataTypes.STRING(100),
    allowNull: true,
  },
});
