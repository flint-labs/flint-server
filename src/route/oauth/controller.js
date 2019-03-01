const bcrypt = require('bcrypt');
const { Users } = require('../../models');
const { getLogger } = require('../../../config');
const { signToken } = require('../../lib/util');

const signAccessToken = signToken('x-access-token');
const signRefreshToken = signToken('x-refresh-token');
const logger = getLogger('Oauth');

// GET /oauth/signIn
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(400).send('이메일이 등록되어있지 않습니다 :(');

    const encrypted = user.password;
    const isAutenticated = await bcrypt.compare(password, encrypted);
    if (!isAutenticated) return res.status(400).send('비밀번호가 맞지 않습니다 :(');

    const { dataValues } = user;
    delete dataValues.password;
    const secret = req.app.get('jwt-secret');
    const accessToken = await signAccessToken(dataValues, secret);
    const refreshToken = await signRefreshToken(dataValues, secret);
    res.set('x-access-token', accessToken);
    res.set('x-refresh-token', refreshToken);

    return res.status(200).send({ user: dataValues });
  } catch (error) {
    return logger.error(error);
  }
};

// GET /oauth/accessToken
exports.issueAccessToken = async (req, res) => {
  try {
    const { userInfo } = req;
    const secret = req.app.get('jwt-secret');
    const accessToken = await signAccessToken(userInfo, secret);
    res.set('x-access-token', accessToken);

    res.status(200).send({ user: userInfo });
  } catch (error) {
    logger.error(error);
  }
};
