// const Sequelize = require('sequelize');
const { Reports, Challenges, Users } = require('../../../models');
const { getLogger } = require('../../../../config');

const logger = getLogger('Challenges');
// const { Op } = Sequelize;

// POST /api/reports/postReport/
exports.postReport = async (req, res) => {
  try {
    const report = req.body;

    const userAndRefereeId = await Challenges.findAll({
      attributes: ['userId', 'refereeId'],
      where: { id: report.challengeId },
    });
    const { userId, refereeId } = userAndRefereeId[0].dataValues;
    if (userId === refereeId) {
      report.isConfirmed = 'true'; // 모드 확인해서 셀프면 true
    } else {
      // referee mode
      console.log(refereeId);
      const io = req.app.get('socketio');
      const nickname = await Users.findAll({
        attributes: ['nickname'],
        where: { id: userId },
      });
      io.emit(refereeId, { ...report, userId, nickname: nickname[0].dataValues.nickname });
    }
    const reported = await Reports.create(report);
    return res.status(200).send({ reported });
  } catch (error) {
    return logger.error(error);
  }
};
