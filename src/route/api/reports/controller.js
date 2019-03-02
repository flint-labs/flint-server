const Sequelize = require('sequelize');
const { Reports } = require('../../../models');
const { getLogger } = require('../../../../config');

const logger = getLogger('Challenges');
const { Op } = Sequelize;

// POST /api/reports/postReport/
exports.postReport = async (req, res) => {
  try {
    const report = req.body;
    const reported = await Reports.create(report);
    return res.status(200).send({ reported });
  } catch (error) {
    return logger.error(error);
  }
};
