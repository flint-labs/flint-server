const Sequelize = require('sequelize');
const axios = require('axios');
const db = require('../../../models');
const { Reports, Challenges, Users } = require('../../../models');
const { getLogger } = require('../../../../config');

const logger = getLogger('Challenges');
const { Op } = Sequelize;

// POST /api/reports/postReport/
exports.postReport = async (req, res) => {
  try {
    const report = req.body;

    const userAndRefereeId = await Challenges.findAll({
      where: { id: report.challengeId },
    });
    const { userId, refereeId } = userAndRefereeId[0].dataValues;
    const reported = await Reports.create(report);
    if (userId === refereeId) {
      // report.isConfirmed = 'true'; // 모드 확인해서 셀프면 true
      await Reports.update(
        { isConfirmed: 'true' },
        {
          where: { id: reported.id },
        },
      );
    } else {
      // referee mode
      const { id, nickname } = (await Users.findAll({
        where: {
          id: userId,
        },
      }))[0].dataValues;
      // const io = req.app.get('socketio');
      // io.emit(refereeId, {
      //   ...reported.dataValues,
      //   userId: id,
      //   nickname,
      // });
      const response = await Users.findOne({
        where: { id: refereeId },
      });
      const token = response.dataValues.pushToken;
      axios.post(
        'https://exp.host/--/api/v2/push/send',
        {
          to: token,
          title: 'Flint',
          body: '확인 요청이 왔어요',
          sound: 'default',
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
    }
    return res.status(200).send({ reported });
  } catch (error) {
    return logger.error(error);
  }
};

// GET /api/reports/getReports/:challengeId
exports.getReports = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const reports = await Reports.findAll({
      where: { challengeId },
    });
    return res.status(200).send({ reports });
  } catch (error) {
    return logger.error(error);
  }
};

// POST /api/reports/responseReport/
exports.responseReport = async (req, res) => {
  const confirm = req.body;
  try {
    await Reports.update({ isConfirmed: confirm.check }, { where: { id: confirm.reportId } });

    return res.status(200).send('ok');
  } catch (err) {
    return res.status(400).send({ err });
  }
};

// GET /api/reports/getRequireList/:id
exports.getRequireList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await Reports.findAll({
      where: { isConfirmed: 'pending' },

      include: [
        {
          model: Challenges,
          where: {
            refereeId: id,
          },
        },
      ],
    });

    const tempNicknameArray = list.map(ele => Users.findAll({
      where: { id: ele.challenge.userId },
    }));

    const temp = await Promise.all(tempNicknameArray);

    for (let i = 0; i < temp.length; i += 1) {
      list[i].dataValues.nickname = temp[i][0].dataValues.nickname;
    }

    return res.status(200).send(list);
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ error });
  }
};

// PUT /api/reports/updateReports/
exports.updateReports = async (req, res) => {
  const { reportsId, willBeConfirmed } = req.body;
  try {
    const result = await Reports.update(
      { isConfirmed: willBeConfirmed },
      {
        where: {
          id: {
            [Op.or]: reportsId,
          },
        },
      },
    );
    return res.status(200).send(result);
  } catch (error) {
    return logger.error(error);
  }
};

// GET /api/reports/getFailureReport/:userId
exports.getFailureReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const failureChallenge = await Reports.findAll({
      where: { isConfirmed: 'false' },
      include: [
        {
          model: Challenges,
          where: {
            state: 'inProgress',
            userId,
          },
        },
      ],
    });
    return res.status(200).send(failureChallenge);
  } catch (error) {
    return logger.error(error);
  }
};

// GET /api/reports/getSuccessOneShot/:userId
exports.getSuccessOneShot = async (req, res) => {
  try {
    const { userId } = req.params;
    const successOneShot = await Reports.findAll({
      where: { isConfirmed: 'true' },
      include: [
        {
          model: Challenges,
          where: {
            state: 'inProgress',
            userId,
            isOnGoing: false,
          },
        },
      ],
    });
    return res.status(200).send(successOneShot);
  } catch (error) {
    return logger.error(error);
  }
};

// GET /api/reports/getSuccessOnGoing/:userId
exports.getSuccessOnGoing = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await db.sequelize.query(
      `SELECT r.id AS reportId, ch.id AS id, ch.title, ch.refereeId, ch.startAt, ch.week, ch.checkingPeriod, ch.state, ch.amount, ch.isOnGoing, u.id AS userId FROM reports r INNER JOIN challenges ch ON r.challengeId = ch.id INNER JOIN users u ON ch.userId = u.id WHERE u.id = ${userId} AND ch.state='inProgress' AND r.isConfirmed = 'true'`,
    );
    let result = null;
    const challengesId = Array.from(new Set(response[0].map(el => el.id)));
    challengesId.forEach(el => {
      const reports = response[0].filter(element => element.id === el);
      if (!result && reports.length / (reports[0].week * reports[0].checkingPeriod) >= 1) {
        const [answer] = reports;
        result = answer;
      }
    });
    return res.status(200).send(result);
  } catch (error) {
    return logger.error(error);
  }
};
