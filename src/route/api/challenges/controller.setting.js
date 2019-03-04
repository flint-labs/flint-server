const { Challenges, Users, Charities } = require('../../../models');

exports.challengeSetting = async (req, res) => {
  const {
    title,
    startYear,
    startMonth,
    startDay,
    week,
    checkingPeriod,
    amount,
    isOnGoing,
    slogan,
    referee,
    userId,
    selectUser,
    selectCharity,
    category,
  } = req.body;

  const startAt = new Date(startYear, startMonth - 1, startDay);
  const endAt = new Date(startAt.getTime() + 604800000 * week);
  const state = startAt.getTime() - Date.now() > 0 ? 'pendding' : 'inProgress';

  const refereeId = await Users.findOne({
    where: { nickname: referee },
    attributes: ['id'],
  });
  const receipientUserId = await Users.findOne({
    where: { nickname: selectUser },
    attributes: ['id'],
  });

  console.log(req.body);

  await Challenges.create({
    title,
    userId,
    startAt,
    endAt,
    category,
    state,
    isOnGoing,
    slogan,
    refereeId: refereeId.dataValues.id || userId,
    checkingPeriod: Number(checkingPeriod),
    amount: Number(amount.split(',').join('')),
    receipient_user_id: receipientUserId.dataValues.id || null,
    receipient_charity_id: selectCharity || null,
    description: 'undefined',
  });

  res.status(200).send('ok');
};

exports.charities = async (req, res) => {
  try {
    const charitieList = await Charities.findAll();

    res.status(200).send(charitieList);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
