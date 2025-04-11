const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  user: Joi.string().required().label(i18n.__('labelUser')),
  name: Joi.string().required().label(i18n.__('labelName')),
  balance: Joi.number().required().label(i18n.__('labelBalance')),
})

const updateValidation = Joi.object({
  name: Joi.string().label(i18n.__('labelName')),
  cards: Joi.array()
    .items(
      Joi.object({
        cardUserKey: Joi.string().label(i18n.__('labelCardUserKey')),
        cardToken: Joi.string().label(i18n.__('labelCardToken')),
        cardAlias: Joi.string().label(i18n.__('labelCardAlias')),
      })
    )
    .label(i18n.__('labelCards')),
  transactions: Joi.array().label(i18n.__('labelTransactions')),
})

module.exports = {
  createValidation,
  updateValidation,
}
