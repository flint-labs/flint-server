const route = require('express').Router();

const controller = require('./controller.setting');
const dashboardController = require('./dashboardController');
const { checkToken } = require('../../../lib/middleware');

const checkAccessToken = checkToken('x-access-token');

route.get('/', (req, res) => {
  res.send('this is challenge route');
});

// 준홍
route.post('/setting', controller.challengeSetting);

route.get('/charities', controller.charities);

// 건
route.get(
  '/getInProgressChallenges/:userId',
  checkAccessToken,
  dashboardController.getInProgressChallenges,
);

route.get(
  '/getChallengesHistory/:userId',
  checkAccessToken,
  dashboardController.getChallengesHistory,
);

route.put('/updateChallengesState', checkAccessToken, dashboardController.updateChallengesState);

module.exports = route;
