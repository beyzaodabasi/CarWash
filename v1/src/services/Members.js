const BaseService = require('./BaseService')
const MemberModel = require('../models/Member')
const i18n = require('../config/translate')

class Members extends BaseService {
  constructor() {
    super(MemberModel)
  }

  create(data) {
    const localTime = new Date(Date.now() + 10800000)
    return new Promise(async (resolve, reject) => {
      await MemberModel.find({ email: data.email })
        .then(async (response) => {
          if (response.length > 0) {
            reject(new Error(i18n.__('memberCreateError')))
          } else {
            await MemberModel.create(data)
              .then((response) => {
                if (response) {
                  resolve(response)
                } else {
                  reject(new Error(i18n.__('memberCreateError')))
                }
              })
              .catch((err) => {
                err.message = i18n.__('memberCreateError')
                reject(err)
              })
          }
        })
        .catch((err) => {
          err.message = i18n.__('memberCreateError')
          reject(err)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findOne(where)
        .populate('user')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('memberNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('memberNotFound')
          reject(error)
        })
    })
  }

  // override
  list(where) {
    return new Promise((resolve, reject) => {
      MemberModel.find(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('memberListError')))
        })
        .catch((error) => {
          error.message = i18n.__('memberListError')
          reject(error)
        })
    })
  }

  // override update
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('userUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('userUpdateError')
          reject(error)
        })
    })
  }

  // override delete
  delete(id) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('userDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('userDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Members()
