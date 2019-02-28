module.exports = (sequelize, DataTypes) => sequelize.define('charities', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  accountNumber: {
    field: 'accountNumber',
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  accountBank: {
    field: 'accountBank',
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  accountHolder: {
    field: 'accountHolder',
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    field: 'description',
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  url: {
    field: 'url',
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});
