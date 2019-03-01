const route = require('express').Router();
const controller = require('./controller');

<<<<<<< HEAD
route.get('/', (req, res) => {
  res.send('this is user route');
});

=======
>>>>>>> 95eda32bd858775f51f96818a11e165a385aae25
route.get('/checkEmail/:email', controller.checkEmail);
route.post('/signUp', controller.signUp);

module.exports = route;
