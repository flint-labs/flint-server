const route = require('express').Router();
const controller = require('./controller');

route.post('/postReport', controller.postReport);

route.get('/getReports/:challengeId');

module.exports = route;
