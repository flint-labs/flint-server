const route = require('express').Router();
const controller = require('./controller');

route.post('/postReport', controller.postReport);

route.post('/responseReport', controller.responseReport);
route.get('/getNotPendingReports/:challengeId', controller.getNotPendingReports);

module.exports = route;
