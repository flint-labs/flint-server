const { Challenges } = require('../../../models');

// GET /api/history/completeList/:userId
exports.completeList = async (req, res) => {
  const { userId } = req.params;
  const completeChallengelist = await Challenges.findAll({
    where: {
      userId,
      $or: [{ state: { $eq: 'success' } }, { state: { $eq: 'faliure' } }],
    },
  });

  res.status(200).send(completeChallengelist);
};
