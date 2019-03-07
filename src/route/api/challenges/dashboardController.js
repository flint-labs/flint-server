const Sequelize = require('sequelize');
const { Challenges } = require('../../../models');
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

// PUT /api/challenges/updateChallengeState/:challengeId/:willState
exports.updateChallengeState = async (req, res) => {
  try {
    const { challengeId, willState } = req.params;
    let updateChallenge;
    if (willState === 'success') {
      updateChallenge = await Challenges.update(
        { state: 'success' },
        { where: { id: challengeId } },
      );
    } else {
      updateChallenge = await Challenges.update(
        { state: 'failure' },
        { where: { id: challengeId } },
      );
    }
    return res.status(200).send({ updateChallenge });
  } catch (error) {
    return logger.error(error);
  }
};
