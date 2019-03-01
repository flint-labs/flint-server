const route = require('express').Router();

route.use('/users', require('./users'));
route.use('/challengeSetting', require('./challenges'));

module.exports = route;
