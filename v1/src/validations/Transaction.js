const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  wallet: Joi.string().required().label(i18n.__('labelWallet')),
  washing: Joi.string().required().label(i18n.__('labelWashing')),
  amount: Joi.number().required().label(i18n.__('labelAmount')),
  paymentGateway: Joi.string().required().label(i18n.__('labelPaymentGateway')),
  transactionId: Joi.string().required().label(i18n.__('labelTransactionId')),
  type: Joi.number().valid(-1, 0, 1).label(i18n.__('labelType')),
  status: Joi.string().valid('SUCCESSED', 'FAILED').label(i18n.__('labelStatus')),
})

const updateValidation = Joi.object({
  tenant: Joi.string().label(i18n.__('labelTenant')),
  wallet: Joi.string().label(i18n.__('labelWallet')),
  washing: Joi.string().label(i18n.__('labelWashing')),
  amount: Joi.number().label(i18n.__('labelAmount')),
  paymentGateway: Joi.string().label(i18n.__('labelPaymentGateway')),
  transactionId: Joi.string().label(i18n.__('labelTransactionId')),
  type: Joi.number().valid(-1, 0, 1).label(i18n.__('labelType')),
  status: Joi.string().valid('SUCCESSED', 'FAILED').label(i18n.__('labelStatus')),
})

module.exports = {
  createValidation,
  updateValidation,
}
