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

const card3DStartValidation = Joi.object({
  card: Joi.object({
    cardAlias: Joi.string().required().label(i18n.__('labelCardAlias')),
    cardHolderName: Joi.string().required().label(i18n.__('labelCardHolderName')),
    cardNumber: Joi.string().required().label(i18n.__('labelCardNumber')),
    expireMonth: Joi.string().required().label(i18n.__('labelExpireMonth')),
    expireYear: Joi.string().required().label(i18n.__('labelExpireYear')),
    cvc: Joi.string().required().label(i18n.__('labelCvc')),
  })
    .required()
    .label(i18n.__('labelCard')),
})

module.exports = {
  createValidation,
  updateValidation,
  card3DStartValidation,
}
