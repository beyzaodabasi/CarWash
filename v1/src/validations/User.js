const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  name: Joi.string().required().min(5).label(i18n.__('labelName')),
  userName: Joi.string().required().min(5).label(i18n.__('labelUserName')),
  email: Joi.string().required().email().label(i18n.__('labelEmail')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
  gsm: Joi.string().required().min(9).label(i18n.__('labelGsm')),
  userType: Joi.string().required().label(i18n.__('labelUserType')),
  city: Joi.string().required().label(i18n.__('labelCity')),
  town: Joi.string().required().label(i18n.__('labelTown')),
})

const updateValidation = Joi.object({
  name: Joi.string().min(5).label(i18n.__('labelName')),
  userName: Joi.string().min(5).label(i18n.__('labelUserName')),
  password: Joi.string().label(i18n.__('labelPassword')),
  gsm: Joi.string().min(9).label(i18n.__('labelGsm')),
  userType: Joi.string().label(i18n.__('labelUserType')),
  city: Joi.string().label(i18n.__('labelCity')),
  town: Joi.string().label(i18n.__('labelTown')),
})

const loginValidation = Joi.object({
  email: Joi.string().email().required().label(i18n.__('labelEmail')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
})

const refreshValidation = Joi.object({
  accessToken: Joi.string().required().label(i18n.__('labelAccessToken')),
  refreshToken: Joi.string().required().label(i18n.__('labelRefreshToken')),
})

module.exports = {
  createValidation,
  updateValidation,
  loginValidation,
  refreshValidation,
}
