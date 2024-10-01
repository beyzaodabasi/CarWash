const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  name: Joi.string().required().min(5).label(i18n.__('labelName')),
  userName: Joi.string().required().min(5).label(i18n.__('labelUserName')),
  email: Joi.string().email().label(i18n.__('labelEmail')),
  password: Joi.string().label(i18n.__('labelPassword')),
  gsm: Joi.string().required().min(9).label(i18n.__('labelGsm')),
  userType: Joi.string().required().label(i18n.__('labelUserType')),
  city: Joi.string().required().label(i18n.__('labelCity')),
  town: Joi.string().required().label(i18n.__('labelTown')),
})

module.exports = {
  createValidation,
}
