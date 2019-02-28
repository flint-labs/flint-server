const route = require('express').Router();
const controller = require('./controller');

route.get('/', (req, res) => {
  res.send('this is user route');
})

route.get('/checkEmail/:email', controller.checkEmail);
route.post('/signUp', controller.signUp);

module.exports = route;
