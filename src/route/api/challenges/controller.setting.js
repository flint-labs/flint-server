const { Challenges, Users, Charities } = require('../../../models');

// POST /api/challenges/setting
exports.challengeSetting = async (req, res) => {
  const { challenge } = req.body;

  const refereeId = await Users.findOne({
    where: { nickname: challenge.referee },
    attributes: ['id'],
  });

  challenge.refereeId = refereeId.dataValues.id;

  delete challenge.referee;
  try {
    const newChallenge = await Challenges.create(challenge);
    res.status(200).send(newChallenge);
  } catch (err) {
    console.log(err.message);
  }
};

// GET /api/challenges/charities
exports.charities = async (req, res) => {
  try {
    const charitieList = await Charities.findAll();
    res.status(200).send(charitieList);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
