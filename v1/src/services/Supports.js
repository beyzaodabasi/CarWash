const BaseService = require('./BaseService')
const SupportModel = require('../models/Support')
const i18n = require('../config/translate')

class Supports extends BaseService {
  constructor() {
    super(SupportModel)
  }

  //override
  create(data) {
    return new Promise(async (resolve, reject) => {
      await SupportModel.create(data)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('supportCreateError')))
        })
        .catch((err) => {
          err.message = i18n.__('supportCreateError')
          reject(err)
        })
    })
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await SupportModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('supportUpdateError')))
        })
        .catch((err) => {
          err.message = i18n.__('supportUpdateError')
          reject(err)
        })
    })
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      await SupportModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('supportDeleteError')))
        })
        .catch((err) => {
          err.message = i18n.__('supportDeleteError')
          reject(err)
        })
    })
  }

  list(where) {
    return new Promise(async (resolve, reject) => {
      await SupportModel.find(where)
        .populate('member')
        .populate('finishedStaff')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('supportNotFound')))
        })
        .catch((err) => {
          err.message = i18n.__('supportNotFound')
          reject(err)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await SupportModel.findOne(where)
        .populate('tenant')
        .populate('member')
        .populate('finishedStaff')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('supportNotFound')))
        })
        .catch((err) => {
          err.message = i18n.__('supportNotFound')
          reject(err)
        })
    })
  }
}

module.exports = new Supports()