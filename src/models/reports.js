module.exports = (sequelize, DataTypes) =>
  sequelize.define('reports', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    image: {
      field: 'image',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createAt: {
      field: 'createAt',
      type: DataTypes.DATE,
      allowNull: false,
    },
    isConfirmed: {
      field: 'isConfirmed',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    challengeId: {
      field: 'challengeId',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
