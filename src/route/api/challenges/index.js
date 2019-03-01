const route = require('express').Router();
const dashboardController = require('./dashboardController');

route.get('/', (req, res) => {
  res.send('this is challenge route');
});

route.get('/getInProgressChallenges/:userId', dashboardController.getInProgressChallenges);
route.get('/getChallengesHistory/:userId', dashboardController.getChallengesHistory);
// route.post('/', dashboardController.signUp);

module.exports = route;
