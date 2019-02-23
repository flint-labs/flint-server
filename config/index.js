require('dotenv').config();
const log4js = require('log4js');
log4js.configure(require('./log4js.json'));

const { getLogger } = log4js;

const config = {
  getLogger,
};

module.exports = config;
