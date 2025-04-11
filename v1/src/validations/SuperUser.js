const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  firstName: Joi.string().required().min(2).label(i18n.__('labelFirstName')),
  lastName: Joi.string().required().min(2).label(i18n.__('labelLastName')),
  email: Joi.string().required().email().label(i18n.__('labelEmail')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
  gsm: Joi.string().required().min(9).label(i18n.__('labelGsm')),
  city: Joi.string().required().label(i18n.__('labelCity')),
  town: Joi.string().required().label(i18n.__('labelTown')),
  address: Joi.string().label(i18n.__('labelAddress')),
})

const updateValidation = Joi.object({
  firstName: Joi.string().min(2).label(i18n.__('labelFirstName')),
  lastName: Joi.string().min(2).label(i18n.__('labelLastName')),
  address: Joi.string().label(i18n.__('labelAddress')),
  city: Joi.string().label(i18n.__('labelCity')),
  town: Joi.string().label(i18n.__('labelTown')),
})

module.exports = {
  createValidation,
  updateValidation,
}
