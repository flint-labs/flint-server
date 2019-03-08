const route = require('express').Router();

const controller = require('./controller.setting');
const dashboardController = require('./dashboardController');

route.get('/', (req, res) => {
  res.send('this is challenge route');
});

// 준홍
route.post('/setting', controller.challengeSetting);

route.get('/charities', controller.charities);

// 건
route.get(
  '/getInProgressChallenges/:userId',
  dashboardController.getInProgressChallenges,
);

route.get(
  '/getChallengesHistory/:userId',
  dashboardController.getChallengesHistory,
);

route.put(
  '/updateChallengeState/:challengeId/:willState',
  dashboardController.updateChallengeState,
);


module.exports = route;
