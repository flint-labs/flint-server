const route = require('express').Router();

route.use('/users', require('./users'));

route.use('/challenges', require('./challenges'));

module.exports = route;
