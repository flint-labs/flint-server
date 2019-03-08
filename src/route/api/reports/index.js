const route = require('express').Router();
const controller = require('./controller');
const { checkToken } = require('../../../lib/middleware');

const checkAccessToken = checkToken('x-access-token');

route.post('/postReport', controller.postReport);

route.post('/responseReport', checkAccessToken, controller.responseReport);
route.get('/getNotPendingReports/:challengeId', controller.getNotPendingReports);

route.get('/getRequireList/:id', checkAccessToken, controller.getRequireList);

route.put('/updateReports', controller.updateReports);

module.exports = route;
