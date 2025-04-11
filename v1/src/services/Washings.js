const BaseService = require('./BaseService')
const WashingModel = require('../models/Washing')
const uploadImage = require('../scripts/uploadImage')
const i18n = require('../config/translate')

class Washings extends BaseService {
  constructor() {
    super(WashingModel)
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      // TODO: startedImage ve finishedImage base64 olarak gelecek ve uploadImage fonksiyonu ile kaydedilecek

      await WashingModel.create(data)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('washingCreateError')))
        })
        .catch((error) => {
          error.message = i18n.__('washingCreateError')
          reject(error)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await WashingModel.findOne(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('washingNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('washingNotFound')
          reject(error)
        })
    })
  }

  list(where) {
    return new Promise((resolve, reject) => {
      WashingModel.find(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('washingListError')))
        })
        .catch((error) => {
          error.message = i18n.__('washingListError')
          reject(error)
        })
    })
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await WashingModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('washingUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('washingUpdateError')
          reject(error)
        })
    })
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      await WashingModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('washingDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('washingDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Washings()
