const jwt = require('jsonwebtoken');
const util = require('util');
const bcrypt = require('bcrypt');
const logger = require('../../../config').getLogger('Util');

const jwtSign = util.promisify(jwt.sign);

/**
 *  @function
 *  `JsonWebToken` 을 발행하는 함수 사용자 인증이 필요한 자원에 접근할 때 사용된다.
 *  @param {string} token `x-access-token` 또는 `x-refresh-token` 이 입력된다.
 */
exports.signToken = token => (userInfo, secret) => {
  const expiresIn = token === 'x-access-token' ? '3h' : '14d';
  const tokenOption = {
    expiresIn,
    issuer: 'flint',
    subject: token,
  };
  return jwtSign(userInfo, secret, tokenOption);
};


/**
 *  @middleware
 *  `bcrypt` 모듈로 암호화를 진행한다. `saltRound` 는 10회 적용된다.
 *  비밀번호가 입력되지 않을 시 `error` 가 발생한다.
 */
exports.encryptPassword = async (password) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    return logger.error(error);
  }
};
