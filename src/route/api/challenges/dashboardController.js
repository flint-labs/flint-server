const { Challenges } = require('../../../models');
const { getLogger } = require('../../../../config');

const logger = getLogger('Challenges');

// GET /api/challenges/userChallenge/:userId/
exports.getInProgressChallenges = async (req, res) => {
  const { userId } = req.params;
  const challenges = await Challenges.findAll({ where: { userId, state: 'inProgress' } });
  res.status(200).send({ challenges });
};

// POST /api/users/signUp
// exports.signUp = async (req, res) => {
//   try {
//     const { user } = req.body;
//     const { value, error } = validateUser(user);
//     if (error) return res.status(400).send('입력하신 양식이 맞지 않습니다 :(');

//     const { email } = value;
//     const isExist = await Users.findOne({ where: { email } });
//     if (isExist) return res.status(400).send('이미 사용된 이메일입니다 :(');

//     const { password } = value;
//     const hash = await encryptPassword(password);
//     const created = await Users.create({ ...value, password: hash });
//     return res.send(created);
//   } catch (error) {
//     return logger.error(error);
//   }
// };
