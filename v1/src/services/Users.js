const BaseService = require('./BaseService')
const UserModel = require('../models/User')
const { createPasswordToHash } = require('../scripts/utils/auth')
const i18n = require('../config/translate')

class Users extends BaseService {
  constructor() {
    super(UserModel)
  }

  create(data) {
    const localTime = new Date(Date.now() + 10800000)
    data.created_date = localTime
    data.updated_date = localTime
    return new Promise(async (resolve, reject) => {
      // Email ve Gsm ile kullanıcı aranıp, eğer varsa hata döndürülür.
      await UserModel.findOne({ $or: [{ email: data.email }, { gsm: data.gsm }] })
        .then(async (response) => {
          if (response) {
            if (response.email === data.email) {
              reject(new Error(i18n.__('userEmailExist')))
            } else if (response.gsm === data.gsm) {
              reject(new Error(i18n.__('userGsmExist')))
            }
          } else {
            await UserModel.create(data)
              .then((response) => {
                if (response) resolve(response)
                else reject(new Error(i18n.__('userCreateError')))
              })
              .catch((error) => {
                error.message = i18n.__('userCreateError')
                reject(error)
              })
          }
        })
        .catch((error) => {
          error.message = i18n.__('userCreateError')
          reject(error)
        })
    })
  }

  // override
  list(where) {
    return new Promise((resolve, reject) => {
      UserModel.find(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('userListError')))
        })
        .catch((error) => {
          error.message = i18n.__('userListError')
          reject(error)
        })
    })
  }

  // override findOne
  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await UserModel.findOne(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('userNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('userNotFound')
          reject(error)
        })
    })
  }

  // override update
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await UserModel.findByIdAndUpdate(id, data, { new: true })
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
      await UserModel.findByIdAndDelete(id)
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

module.exports = new Users()
