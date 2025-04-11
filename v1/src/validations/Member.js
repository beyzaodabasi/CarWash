const Joi = require('joi')
const i18n = require('../config/translate')

const loginValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  gsm: Joi.string().required().label(i18n.__('labelGsm')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
})

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  email: Joi.string().required().email().label(i18n.__('labelEmail')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
  firstName: Joi.string().required().label(i18n.__('labelFirstName')),
  lastName: Joi.string().required().label(i18n.__('labelLastName')),
  birthDate: Joi.date().required().label(i18n.__('labelBirthDate')),
  otherNationality: Joi.boolean().required().label(i18n.__('labelOtherNationality')),
  tckn: Joi.string().required().label(i18n.__('labelTckn')),
  vkn: Joi.string().label(i18n.__('labelVkn')),
  gsm: Joi.string().required().min(9).label(i18n.__('labelGsm')),
  city: Joi.string().required().label(i18n.__('labelCity')),
  town: Joi.string().required().label(i18n.__('labelTown')),
})

const updateValidation = Joi.object({
  firstName: Joi.string().label(i18n.__('labelFirstName')),
  lastName: Joi.string().label(i18n.__('labelLastName')),
  birthDate: Joi.date().label(i18n.__('labelBirthDate')),
  otherNationality: Joi.boolean().label(i18n.__('labelOtherNationality')),
  tckn: Joi.string().label(i18n.__('labelTckn')),
  vkn: Joi.string().label(i18n.__('labelVkn')),
})

module.exports = {
  loginValidation,
  createValidation,
  updateValidation,
}
