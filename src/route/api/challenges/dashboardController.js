const Sequelize = require('sequelize');
const { Challenges, Reports } = require('../../../models');
const { getLogger } = require('../../../../config');

const logger = getLogger('Challenges');
const { Op } = Sequelize;

// GET /api/challenges/getInProgressChallenges/:userId/
exports.getInProgressChallenges = async (req, res) => {
  try {
    const { userId } = req.params;
    const challenges = await Challenges.findAll({
      where: { userId, [Op.or]: [{ state: 'inProgress' }, { state: 'pending' }] },
    });
    return res.status(200).send({ challenges });
  } catch (error) {
    return logger.error(error);
  }
};

// GET /api/challenges/getChallengesHistory/:userId/
exports.getChallengesHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const challenges = await Challenges.findAll({
      where: { userId, [Op.or]: [{ state: 'success' }, { state: 'failure' }] },
    });
    return res.status(200).send({ challenges });
  } catch (error) {
    return logger.error(error);
  }
};

// PUT /api/challenges/updateChallengesState/
exports.updateChallengesState = async (req, res) => {
  try {
    const { challengesId, willState } = req.body;
    const updateChallenge = await Challenges.update(
      { state: willState },
      {
        where: {
          id: {
            [Op.or]: challengesId,
          },
        },
      },
    );
    return res.status(200).send({ updateChallenge });
  } catch (error) {
    return logger.error(error);
  }
};

// GET /api/challenges/getFailureChallenge/:userId
exports.getFailureChallenge = async (req, res) => {
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
