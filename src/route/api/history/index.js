const route = require('express').Router();
const controller = require('./controller');
const { checkToken } = require('../../../lib/middleware');

const checkAccessToken = checkToken('x-access-token');

route.get('/completeList/:userId', checkAccessToken, controller.completeList);

module.exports = route;
