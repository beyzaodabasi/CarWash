const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  staff: Joi.string().required().label(i18n.__('labelStaff')),
  member: Joi.string().required().label(i18n.__('labelMember')),
  start: Joi.date().label(i18n.__('labelStart')),
  total: Joi.number().required().label(i18n.__('labelTotal')),
})

const updateValidation = Joi.object({
  tenant: Joi.string().label(i18n.__('labelTenant')),
  staff: Joi.string().label(i18n.__('labelStaff')),
  member: Joi.string().label(i18n.__('labelMember')),
  transaction: Joi.string().label(i18n.__('labelTransaction')),
  invoiceInfo: Joi.object({
    id: Joi.string().label(i18n.__('labelId')),
    invoiceNumber: Joi.string().label(i18n.__('labelInvoiceNumber')),
  }).label(i18n.__('labelInvoiceInfo')),
  startedUser: Joi.string().label(i18n.__('labelStartedUser')),
  finishedUser: Joi.string().label(i18n.__('labelFinishedUser')),
  start: Joi.date().label(i18n.__('labelStart')),
  end: Joi.date().label(i18n.__('labelEnd')),
  total: Joi.number().label(i18n.__('labelTotal')),
  status: Joi.string().valid('WAITING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED').label(i18n.__('labelStatus')),
  cancelledBy: Joi.string().label(i18n.__('labelCancelledBy')),
  // startedImage: Joi.object({
  //     key: Joi.string().label(i18n.__('labelKey')),
  //     url: Joi.string().label(i18n.__('labelUrl')),
  // }).label(i18n.__('labelStartedImage')),
  base64startedImage: Joi.string().label(i18n.__('labelBase64StartedImage')),
  // finishedImage: Joi.object({
  //     key: Joi.string().label(i18n.__('labelKey')),
  //     url: Joi.string().label(i18n.__('labelUrl')),
  // }).label(i18n.__('labelFinishedImage')),
  base64finishedImage: Joi.string().label(i18n.__('labelBase64FinishedImage')),
})

module.exports = {
  createValidation,
  updateValidation,
}
