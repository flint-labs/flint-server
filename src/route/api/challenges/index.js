const route = require('express').Router();
const controller = require('./controller.setting');

route.post('/setting', controller.challengeSetting);
route.get('/', controller.health);

module.exports = route;
