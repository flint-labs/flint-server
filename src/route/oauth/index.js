const route = require('express').Router();
const controller = require('./controller');

route.get('/signIn', controller.signIn);
route.get('/accessToken', controller.issueAccessToken);

module.exports = route;
