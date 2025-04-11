const BaseService = require('./BaseService')
const DeviceModel = require('../models/Device')
const uploadImage = require('../scripts/uploadImage')
const moment = require('moment')
const i18n = require('../config/translate')

class Devices extends BaseService {
  constructor() {
    super(DeviceModel)
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      const file = {
        base64Data: data.base64image,
      }
      await uploadImage(file)
        .then(async (response) => {
          data.image = {
            key: response.key,
            url: response.path,
          }
          const licenseFile = {
            base64Data: data.base64licenseImage,
          }
          await uploadImage(licenseFile)
            .then(async (response) => {
              data.licenseImage = {
                key: response.key,
                url: response.path,
              }
              await DeviceModel.create(data)
                .then((response) => {
                  if (response) resolve(response)
                  else reject(new Error(i18n.__('deviceCreateError')))
                })
                .catch((error) => {
                  error.message = i18n.__('deviceCreateError')
                  reject(error)
                })
            })
            .catch((error) => {
              error.message = i18n.__('deviceCreateImageError')
              reject(error)
            })
        })
        .catch((error) => {
          error.message = i18n.__('deviceCreateImageError')
          reject(error)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await DeviceModel.findOne(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('deviceNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('deviceNotFound')
          reject(error)
        })
    })
  }

  list(where) {
    return new Promise((resolve, reject) => {
      DeviceModel.find(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('deviceListError')))
        })
        .catch((error) => {
          error.message = i18n.__('deviceListError')
          reject(error)
        })
    })
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await DeviceModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('deviceUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('deviceUpdateError')
          reject(error)
        })
    })
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      await DeviceModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('deviceDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('deviceDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Devices()
