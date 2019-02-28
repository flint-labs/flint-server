require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const log4js = require('log4js');
log4js.configure(require('./log4js'));

const { getLogger } = log4js;
const dbConfig = require('./sequelize')[env];

const config = {
  getLogger, dbConfig,
};

module.exports = config;
