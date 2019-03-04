const route = require('express').Router();
const controller = require('./controller');

route.post('/postReport', controller.postReport);

route.post('/responseReport', controller.responseReport);

module.exports = route;
