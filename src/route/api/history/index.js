const route = require('express').Router();
const controller = require('./controller');

route.get('/completeList/:userId', controller.completeList);

module.exports = route;
