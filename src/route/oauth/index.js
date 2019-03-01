const route = require('express').Router();
const controller = require('./controller');
const { checkToken } = require('../../lib/middleware');

const checkRefreshToken = checkToken('x-refresh-token');

route.get('/signIn', controller.signIn);
route.get('/accessToken', checkRefreshToken, controller.issueAccessToken);

module.exports = route;
