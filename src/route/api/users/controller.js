const { Users, Challenges, Reports } = require('../../../models');
const {
  Joi: { validateUser },
} = require('../../../service');
const { encryptPassword } = require('../../../lib/util');
const { getLogger } = require('../../../../config');

const logger = getLogger('Users');

// GET /api/users
exports.getAll = async (req, res) => {
  try {
    const { all } = req.query;
    if (all) {
      const users = await Users.findAll();
      res.send(users);
    } else {
      const query = Object.entries(req.query);
      const users = await Users.findAll({
        attributes: query
          .filter(entry => entry[1] === 'true')
          .map(entry => entry[0]),
      });
      res.send(users);
    }
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error });
  }
};

// GET /api/users/:id
exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findOne({ where: { id } });
    if (!user) return res.status(400).send('등록되지 않은 사용자입니다 :(');

    const list = await Challenges.findAll({
      where: { userId: id, merchant_uid: { $not: null } },
    });

    const totalChallenges = list.length;
    let inProgress = 0;
    let success = 0;
    let amount = 0;

    list.forEach(ele => {
      if (ele.dataValues.state === 'inProgress') {
        inProgress += 1;
      }
      if (ele.dataValues.state === 'success') {
        success += 1;
        amount += Number(ele.dataValues.amount);
      }
    });

    const { dataValues } = user;
    delete dataValues.password;

    dataValues.totalChallenges = totalChallenges;
    dataValues.inProgress = inProgress;
    dataValues.success = success;
    dataValues.amount = amount;

    return res.status(200).send({ user: dataValues });
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ error });
  }
};

// GET /api/users/checkEmail/:email
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const emailExist = await Users.findOne({ where: { email } });
    res.status(200).send({ isExist: !!emailExist });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error });
  }
};

// GET /api/users/checkNickname/:nickname
exports.checkNickname = async (req, res) => {
  try {
    const { nickname } = req.params;
    const nicknameExist = await Users.findOne({ where: { nickname } });
    res.status(200).send({ isExist: !!nicknameExist });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error });
  }
};

// POST /api/users/signUp
exports.signUp = async (req, res) => {
  try {
    const { user } = req.body;
    const { value, error } = validateUser(user);
    if (error) {
      return res.status(400).send('입력하신 양식이 맞지 않습니다 :(');
    }

    const { email } = value;
    const emailExist = await Users.findOne({ where: { email } });
    if (emailExist) {
      return res.status(400).send('이미 사용된 이메일입니다 :(');
    }

    const { nickname } = value;
    const nicknameExist = await Users.findOne({ where: { nickname } });
    if (nicknameExist) {
      return res.status(400).send('이미 사용된 닉네임입니다 :(');
    }

    const { password } = value;
    const encrypted = await encryptPassword(password);
    const created = await Users.create({ ...value, password: encrypted });

    const { dataValues } = created;
    delete dataValues.password;

    return res.send({ user: dataValues });
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ error });
  }
};

// DELETE /api/users/deleteAccount/:id
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const challengeList = await Challenges.findAll({ where: { userId: id } });

    const deleteReports = challengeList.map(ele =>
      Reports.destroy({ where: { challengeId: ele.id } }),
    );

    await Promise.all(deleteReports);

    const list = await Challenges.findAll({ where: { refereeId: id } });

    const updatedMode = list.map(ele =>
      Challenges.update(
        { refereeId: ele.userId },
        { where: { refereeId: id } },
      ),
    );
    await Promise.all(updatedMode);

    const deleteChallenges = challengeList.map(ele =>
      Challenges.destroy({ where: { id: ele.id } }),
    );
    await Promise.all(deleteChallenges);

    await Users.destroy({ where: { id } });

    return res.status(200).send('delete ok');
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ error });
  }
};
