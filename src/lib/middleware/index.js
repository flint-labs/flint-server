const util = require('util');
const jwt = require('jsonwebtoken');
const logger = require('../../../config').getLogger('Middleware');

const verifyToken = util.promisify(jwt.verify);

/**
 * @middleware
 *  1. Token 의 유효성을 확인한다. 토큰이 헤더에 없을 시 `400` status 응답
 *  2. Token 유효할 시 검증 성공 `next` 실행
 *  3. Token 만료 시 `401` status 응답
 * @param {string} token `x-access-token` 또는 `x-refresh-token` 이 입력된다.
 */
exports.checkToken = token => async (req, res, next) => {
  logger.trace('############################################################');
  logger.trace('@ Verifying token');
  // Token 이 잘 실려있는지 확인한다.
  logger.trace();
  logger.trace('(1/2) Looking for token from header');
  try {
    const secret = req.app.get('jwt-secret');
    const JsonWebToken = req.headers[token];
    if (!JsonWebToken) throw Error('Token is not found');
    logger.trace(`#### Found '${token}' ####`);
    logger.debug(JsonWebToken);

    // Token 의 만료여부를 확인한다.
    logger.trace();
    logger.trace('(2/2) Verifying the token');
    const tokenPayload = await verifyToken(JsonWebToken, secret);
    logger.trace('#### Token Payload ####');
    Object.entries(tokenPayload).forEach((data) => {
      const key = data[0]; let value = data[1];
      if (key === 'iat' || key === 'exp') value = new Date(value * 1000).toLocaleString();
      logger.debug(`${key}  : ${value}`);
      if (key === 'sub') if (value !== token) { logger.error(`The token '${value}' should be '${token}'`); throw Error('Token is invalid'); }
    });
    const userInfo = Object.entries(tokenPayload).reduce((acc, data) => {
      const key = data[0]; const value = data[1];
      const skip = ['iat', 'exp', 'iss', 'sub'];
      if (skip.includes(key)) return acc;
      acc[key] = value;
      return acc;
    }, {});
    req.userInfo = userInfo;
    return next();
  } catch (error) {
    if (error.expiredAt) {
      logger.error(`Token expried at '${error.expiredAt.toLocaleString()}'`);
    } else {
      logger.error(error.message);
    }
    return res.status(401).send(error.message);
  } finally {
    logger.trace('');
    logger.trace('Finish work!');
  }
};
