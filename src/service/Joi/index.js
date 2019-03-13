const Joi = require('joi');

const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const THIS_YEAR = new Date().getFullYear();
exports.validateUser = user => {
  const schema = {
    email: Joi.string()
      .max(50)
      .regex(EMAIL_REGEX)
      .required(),
    password: Joi.string()
      .max(20)
      .regex(PASSWORD_REGEX)
      .required(),
    nickname: Joi.string()
      .max(30)
      .required(),
    gender: Joi.string()
      .valid(['man', 'woman'])
      .required(),
    birth: Joi.number()
      .greater(THIS_YEAR - 121)
      .less(THIS_YEAR + 1)
      .required(),
    location: Joi.string()
      .max(20)
      .default(''),
    change: Joi.number().default(0),
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
    pushToken: Joi.string().allow(''),
  };
  return Joi.validate(user, schema);
};
