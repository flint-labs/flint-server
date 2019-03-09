const { Challenges } = require('../../../models');
const { getLogger } = require('../../../../config');

const logger = getLogger('Challenges');

// GET /api/history/completeList/:userId
exports.completeList = async (req, res) => {
  const { userId } = req.params;

  try {
    const completeChallengelist = await Challenges.findAll({
      where: {
        userId,
        $or: [{ state: { $eq: 'success' } }, { state: { $eq: 'failure' } }],
      },
    });
    return res.status(200).send(completeChallengelist);
  } catch (err) {
    logger.error(err);
    return res.status(400).send({ err });
  }
};
