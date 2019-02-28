const route = require('express').Router();

route.use('/users', require('./users'));

module.exports = route;
