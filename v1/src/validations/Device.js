const Joi = require('joi')
const i18n = require('../config/translate')

const createValidation = Joi.object({
  tenant: Joi.string().required().label(i18n.__('labelTenant')),
  status: Joi.string().valid('ACTIVE', 'PASSIVE').label(i18n.__('labelStatus')),
  plate: Joi.string().required().label(i18n.__('labelPlate')),
  brand: Joi.string().required().label(i18n.__('labelBrand')),
  model: Joi.string().required().label(i18n.__('labelModel')),
  // image: Joi.object({
  //   key: Joi.string().required().label(i18n.__('labelImageKey')),
  //   url: Joi.string().required().label(i18n.__('labelImageUrl')),
  // })
  //   .required()
  //   .label(i18n.__('labelImage')),
  base64image: Joi.string().required().label(i18n.__('labelBase64Image')),
  // licenseImage: Joi.object({
  //   key: Joi.string().required().label(i18n.__('labelLicenseImageKey')),
  //   url: Joi.string().required().label(i18n.__('labelLicenseImageUrl')),
  // })
  //   .required()
  //   .label(i18n.__('labelLicenseImage')),
  base64licenseImage: Joi.string().required().label(i18n.__('labelBase64LicenseImage')),
  type: Joi.string().valid('ELECTRIC', 'HYBRID', 'PETROL', 'DIESEL').required().label(i18n.__('labelType')),
  city: Joi.string().required().label(i18n.__('labelCity')),
  town: Joi.string().required().label(i18n.__('labelTown')),
  country: Joi.string().required().label(i18n.__('labelCountry')),
  hardware: Joi.object({
    ornek: Joi.boolean().label(i18n.__('labelOrnek')),
  }).label(i18n.__('labelHardware')),
})

const updateValidation = Joi.object({
  status: Joi.string().valid('ACTIVE', 'PASSIVE').label(i18n.__('labelStatus')),
  plate: Joi.string().label(i18n.__('labelPlate')),
  brand: Joi.string().label(i18n.__('labelBrand')),
  model: Joi.string().label(i18n.__('labelModel')),
  // image: Joi.object({
  //   key: Joi.string().label(i18n.__('labelImageKey')),
  //   url: Joi.string().label(i18n.__('labelImageUrl')),
  // })
  //   .label(i18n.__('labelImage')),
  base64image: Joi.string().label(i18n.__('labelBase64Image')),
  // licenseImage: Joi.object({
  //   key: Joi.string().label(i18n.__('labelLicenseImageKey')),
  //   url: Joi.string().label(i18n.__('labelLicenseImageUrl')),
  // })
  //   .label(i18n.__('labelLicenseImage')),
  base64licenseImage: Joi.string().label(i18n.__('labelBase64LicenseImage')),
  type: Joi.string().valid('ELECTRIC', 'HYBRID', 'PETROL', 'DIESEL').label(i18n.__('labelType')),
  city: Joi.string().label(i18n.__('labelCity')),
  town: Joi.string().label(i18n.__('labelTown')),
  country: Joi.string().label(i18n.__('labelCountry')),
  hardware: Joi.object({
    ornek: Joi.boolean().label(i18n.__('labelOrnek')),
  }).label(i18n.__('labelHardware')),
})

module.exports = {
  createValidation,
  updateValidation,
}
