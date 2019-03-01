const { Challenges } = require('../../../models');

exports.challengeSetting = (req, res) => {
  const setChallenge = req.body;
  res.status(200).send('ok');
};
