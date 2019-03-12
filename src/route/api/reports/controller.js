const Sequelize = require('sequelize');
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
      const io = req.app.get('socketio');
      io.emit(refereeId, {
        ...reported.dataValues,
        userId: id,
        nickname,
      });
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
    await Reports.update(
      { isConfirmed: confirm.check },
      { where: { id: confirm.reportId } },
    );

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
