const route = require('express').Router();
const controller = require('./controller');
const { checkToken } = require('../../../lib/middleware');

const checkAccessToken = checkToken('x-access-token');

route.post('/postReport', checkAccessToken, controller.postReport);

route.post('/responseReport', checkAccessToken, controller.responseReport);
route.get('/getReports/:challengeId', checkAccessToken, controller.getReports);

route.get('/getRequireList/:id', checkAccessToken, controller.getRequireList);

route.put('/updateReports', checkAccessToken, controller.updateReports);

route.get('/getFailureReport/:userId', checkAccessToken, controller.getFailureReport);

route.get('/getSuccessOneShot/:userId', checkAccessToken, controller.getSuccessOneShot);

module.exports = route;
