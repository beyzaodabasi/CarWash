const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  title: Joi.string().required().label(i18n.__('labelTitle')),
  firstName: Joi.string().required().label(i18n.__('labelFirstName')),
  lastName: Joi.string().required().label(i18n.__('labelLastName')),
  userName: Joi.string().required().label(i18n.__('labelUserName')),
  email: Joi.string().email().required().label(i18n.__('labelEmail')),
  password: Joi.string().required().min(6).label(i18n.__('labelPassword')),
  taxOffice: Joi.string().label(i18n.__('labelTaxOffice')),
  taxNumber: Joi.string().label(i18n.__('labelTaxNumber')),
  address: Joi.string().label(i18n.__('labelAddress')),
  postalCode: Joi.string().label(i18n.__('labelPostalCode')),
  gsm: Joi.string().required().label(i18n.__('labelGsm')),
  city: Joi.string().label(i18n.__('labelCity')),
  town: Joi.string().label(i18n.__('labelTown')),
  country: Joi.string().label(i18n.__('labelCountry')),
  status: Joi.string().label(i18n.__('labelStatus')),
  version: Joi.array().label(i18n.__('labelVersion')),
})

const updateValidation = Joi.object({
  title: Joi.string().label(i18n.__('labelTitle')),
  firstName: Joi.string().label(i18n.__('labelFirstName')),
  lastName: Joi.string().label(i18n.__('labelLastName')),
  userName: Joi.string().label(i18n.__('labelUserName')),
  email: Joi.string().email().label(i18n.__('labelEmail')),
  password: Joi.string().min(6).label(i18n.__('labelPassword')),
  taxOffice: Joi.string().label(i18n.__('labelTaxOffice')),
  taxNumber: Joi.string().label(i18n.__('labelTaxNumber')),
  address: Joi.string().label(i18n.__('labelAddress')),
  postalCode: Joi.string().label(i18n.__('labelPostalCode')),
  gsm: Joi.string().label(i18n.__('labelGsm')),
  city: Joi.string().label(i18n.__('labelCity')),
  town: Joi.string().label(i18n.__('labelTown')),
  country: Joi.string().label(i18n.__('labelCountry')),
  status: Joi.string().label(i18n.__('labelStatus')),
  version: Joi.array().label(i18n.__('labelVersion')),
})

module.exports = {
  createValidation,
  updateValidation,
}
