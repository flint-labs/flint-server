const route = require('express').Router();
const controller = require('./controller');

route.get('/:id', controller.getDetail);
route.get('/checkNickname/:nickname', controller.checkNickname);
route.get('/checkEmail/:email', controller.checkEmail);
route.post('/signUp', controller.signUp);

module.exports = route;
