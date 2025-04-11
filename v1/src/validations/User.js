const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  superUser: Joi.string().label(i18n.__('labelSuperUser')),
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  email: Joi.string().required().email().label(i18n.__('labelEmail')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
  name: Joi.string().required().min(5).label(i18n.__('labelName')),
  gsm: Joi.string().required().min(9).label(i18n.__('labelGsm')),
  city: Joi.string().required().label(i18n.__('labelCity')),
  town: Joi.string().required().label(i18n.__('labelTown')),
  userType: Joi.string().valid('SUPERUSER', 'TENANT', 'MEMBER', 'STAFF').label(i18n.__('labelUserType')),
  pushToken: Joi.string().label(i18n.__('labelPushToken')),
  active: Joi.boolean().label(i18n.__('labelActive')),
})

const updateValidation = Joi.object({
  name: Joi.string().label(i18n.__('labelName')),
  city: Joi.string().label(i18n.__('labelCity')),
  town: Joi.string().label(i18n.__('labelTown')),
  password: Joi.string().label(i18n.__('labelPassword')),
  pushToken: Joi.string().label(i18n.__('labelPushToken')),
  active: Joi.boolean().label(i18n.__('labelActive')),
  passiveDate: Joi.date().label(i18n.__('labelPassiveDate')),
  permissions: Joi.object({
    createValve: Joi.boolean().label(i18n.__('labelCreateValve')),
  }).label(i18n.__('labelPermissions')),
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
