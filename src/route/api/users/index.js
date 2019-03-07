const route = require('express').Router();
const controller = require('./controller');
const { checkToken } = require('../../../lib/middleware');

const checkAccessToken = checkToken('x-access-token');

route.get('/:id', checkAccessToken, controller.getDetail);
route.get('/checkNickname/:nickname', controller.checkNickname);
route.get('/checkEmail/:email', controller.checkEmail);
route.post('/signUp', controller.signUp);
route.delete('/deleteAccount/:id', controller.deleteAccount);

module.exports = route;
