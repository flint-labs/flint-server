const route = require('express').Router();

route.use('/users', require('./users'));

route.use('/challenges', require('./challenges'));

route.use('/reports', require('./reports'));

module.exports = route;
