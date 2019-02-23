const route = require('express').Router();
const controller = require('./oauth.controller');

route.post('/signUp', controller.signUp);
route.post('/signIn', controller.signIn);
route.get('/accessToken', controller.issueAccessToken);

module.exports = route;
