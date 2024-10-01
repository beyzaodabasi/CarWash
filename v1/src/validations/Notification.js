const Joi = require('joi')
const i18n = require('../config/translate')

const sendNotificationValidation = Joi.object({
  title: Joi.string().required().label(i18n.__('labelTitle')),
  message: Joi.string().required().label(i18n.__('labelMessage')),
  priority: Joi.string().valid('default', 'normal', 'high').label(i18n.__('labelPriority')),
})

const sendByUserNotificationValidation = Joi.object({
  title: Joi.string().required().label(i18n.__('labelTitle')),
  message: Joi.string().required().label(i18n.__('labelMessage')),
  priority: Joi.string().valid('default', 'normal', 'high').label(i18n.__('labelPriority')),
})

module.exports = {
  sendNotificationValidation,
  sendByUserNotificationValidation,
}
