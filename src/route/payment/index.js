/* eslint-disable camelcase */
const route = require('express').Router();
const axios = require('axios');
require('dotenv').config();
const { Challenges } = require('../../models');
const { getLogger } = require('../../../config');

const logger = getLogger('Payment');

route.post('/complete/:challengeId', async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body;
    const { challengeId } = req.params;

    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      },
    });
    const { access_token } = getToken.data.response;

    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: 'get',
      headers: { Authorization: access_token },
    });
    const paymentData = getPaymentData.data.response;
    logger.debug('paymentData : ', paymentData);

    const { dataValues: { amount: amountToBePaid } } = await Challenges.findOne({ where: { id: challengeId }, attributes: ['amount'] });
    const { status, pg_provider } = paymentData;
    let { amount } = paymentData;

    if (pg_provider === 'paypal') amount *= 1000;
    if (amount === amountToBePaid && status === 'paid') {
      await Challenges.update({ merchant_uid }, { where: { id: challengeId } });
      res.status(200).send({ status: 'success', message: '일반 결제 성공' });
    } else { // 결제 금액 불일치. 위/변조 된 결제
      res.status(400).send({ status: 'forgery', message: '위조된 결제시도' });
    }
  } catch (error) {
    logger.error(error);
    res.send(error);
  }
});

module.exports = route;
