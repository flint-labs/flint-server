const { Challenges } = require('../../../models');

exports.health = (req, res) => {
  res.status(200).send('ok');
};

exports.challengeSetting = (req, res) => {
  const setChallenge = req.body;
  res.status(200).send('ok');
};
