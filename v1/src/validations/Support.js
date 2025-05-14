const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().label(i18n.__('labelTenant')),
  user: Joi.string().label(i18n.__('labelUser')),
  category: Joi.string().valid('DIGER', 'SYSTEM', '3DSECURE').label(i18n.__('labelCategory')),
  description: Joi.string().label(i18n.__('labelDescription')),
  plate: Joi.string().label(i18n.__('labelPlate')),
  status: Joi.string().valid('ACTIVE', 'DONE', 'CONTROLLED').label(i18n.__('labelStatus')),
})

const updateValidation = Joi.object({
  note: Joi.string().label(i18n.__('labelNote')),
  status: Joi.string().valid('ACTIVE', 'DONE', 'CONTROLLED').label(i18n.__('labelStatus')),
})

module.exports = {
  createValidation,
  updateValidation,
}
