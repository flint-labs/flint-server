const { Users } = require('../../../models');
const { Joi: { validateUser } } = require('../../../service');
const { encryptPassword } = require('../../../lib/util');
const { getLogger } = require('../../../../config');

const logger = getLogger('Users');

// GET /api/users/checkEmail/:email
exports.checkEmail = async (req, res) => {
  const { email } = req.params;
  const userExist = await Users.findOne({ where: { email } });
  res.status(200).send({ isExist: !!userExist });
};

// POST /api/users/signUp
exports.signUp = async (req, res) => {
  try {
    const { user } = req.body;
    const { value, error } = validateUser(user);
    if (error) return res.status(400).send('입력하신 양식이 맞지 않습니다 :(');

    const { email } = value;
    const isExist = await Users.findOne({ where: { email } });
    if (isExist) return res.status(400).send('이미 사용된 이메일입니다 :(');

    const { password } = value;
    const encrypted = await encryptPassword(password);
    const created = await Users.create({ ...value, password: encrypted });
    return res.send(created);
  } catch (error) {
    return logger.error(error);
  }
};
