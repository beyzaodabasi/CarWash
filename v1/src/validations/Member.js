const Joi = require('joi')
const i18n = require('../config/translate')

const loginValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  gsm: Joi.string().required().label(i18n.__('labelGsm')),
  password: Joi.string().required().label(i18n.__('labelPassword')),
})

const smsLoginValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  gsm: Joi.string().required().label(i18n.__('labelGsm')),
  uid: Joi.string().label(i18n.__('labelUid')),
  dateTime: Joi.string().required().label(i18n.__('labelDateTime')),
  hash: Joi.string().required().label(i18n.__('labelHash')),
})

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  email: Joi.string().required().email().label(i18n.__('labelEmail')),
  firstName: Joi.string().required().label(i18n.__('labelFirstName')),
  lastName: Joi.string().required().label(i18n.__('labelLastName')),
  birthDate: Joi.date().required().label(i18n.__('labelBirthDate')),
  otherNationality: Joi.boolean().required().label(i18n.__('labelOtherNationality')),
  nation: Joi.string().required().label(i18n.__('labelNation')),
  gender: Joi.string().required().valid('E', 'K').label(i18n.__('labelGender')),
  uid: Joi.string().label(i18n.__('labelUid')),
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
  // otherNationality: Joi.boolean().label(i18n.__('labelOtherNationality')),
  // tckn: Joi.string().label(i18n.__('labelTckn')),
  vkn: Joi.string().label(i18n.__('labelVkn')),
  devices: Joi.array().items(Joi.string()).label(i18n.__('labelDevices')),
  addresses: Joi.array()
    .items(
      Joi.object({
        isActive: Joi.boolean(),
        address: Joi.string(),
        city: Joi.string(),
        town: Joi.string(),
      })
    )
    .label(i18n.__('labelAddresses')),
  uid: Joi.string().label(i18n.__('labelUid')),
})

module.exports = {
  loginValidation,
  smsLoginValidation,
  createValidation,
  updateValidation,
}
