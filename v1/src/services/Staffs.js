const BaseService = require('./BaseService')
const StaffModel = require('../models/Staff')
const i18n = require('../config/translate')
const Staff = require('../models/Staff')

class Staffs extends BaseService {
  constructor() {
    super(StaffModel)
  }

  create(data) {
    const localTime = new Date(Date.now() + 10800000)
    return new Promise(async (resolve, reject) => {
      await Staff.find({ email: data.email })
        .then(async (response) => {
          if (response.length > 0) {
            reject(new Error(i18n.__('staffCreateError')))
          } else {
            await StaffModel.create(data)
              .then((response) => {
                if (response) resolve(response)
                else reject(new Error(i18n.__('staffCreateError')))
              })
              .catch((err) => {
                err.message = i18n.__('staffCreateError')
                reject(err)
              })
          }
        })
        .catch((err) => {
          err.message = i18n.__('staffCreateError')
          reject(err)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await StaffModel.findOne(where)
        .populate('user')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('staffNotFound')
          reject(error)
        })
    })
  }

  // override
  list(where) {
    return new Promise((resolve, reject) => {
      StaffModel.find(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffListError')))
        })
        .catch((error) => {
          error.message = i18n.__('staffListError')
          reject(error)
        })
    })
  }

  // override update
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await StaffModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('staffUpdateError')
          reject(error)
        })
    })
  }

  // override delete
  delete(id) {
    return new Promise(async (resolve, reject) => {
      await StaffModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('staffDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Staffs()
