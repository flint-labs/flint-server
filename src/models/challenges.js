module.exports = (sequelize, DataTypes) =>
  sequelize.define('challenges', {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    title: {
      field: 'title',
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    userId: {
      field: 'userId',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refereeId: {
      field: 'refereeId',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startAt: {
      field: 'startAt',
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      field: 'endAt',
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkingPeriod: {
      field: 'checkingPeriod',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      field: 'category',
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    state: {
      field: 'state',
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    amount: {
      field: 'amount',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receipient_user_id: {
      field: 'receipient_user_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    receipient_charity_id: {
      field: 'receipient_charity_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isOnGoing: {
      field: 'isOnGoing',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    slogan: {
      field: 'slogan',
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      field: 'description',
      type: DataTypes.STRING(50),
    },
  });
