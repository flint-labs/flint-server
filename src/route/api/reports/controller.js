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
        { isConfirmed: true },
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
exports.getNotPendingReports = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const reports = await Reports.findAll({
      where: { challengeId, isConfirmed: { [Op.ne]: 'pending' } },
    });
    return res.status(200).send({ reports });
  } catch (error) {
    return logger.error(error);
  }
};

// POST /api/reports/responseReport/
exports.responseReport = (req, res) => {
  const check = req.body;
  res.status(200).send('ok');
};
