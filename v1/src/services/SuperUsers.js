const BaseService = require('./BaseService')
const SuperUserModel = require('../models/SuperUser')
const UserService = require('./Users')
const i18n = require('../config/translate')

class SuperUsers extends BaseService {
  constructor() {
    super(SuperUserModel)
  }

  //override
  create(data) {
    return new Promise(async (resolve, reject) => {
      const userData = {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        gsm: data.gsm,
        city: data.city,
        town: data.town,
        userType: 'SUPERUSER',
        version: data.version,
      }
      await UserService.create(userData)
        .then(async (user) => {
          data.user = user._id
          await SuperUserModel.create(data)
            .then((response) => {
              user.superUser = response._id
              user.save()
              if (response) resolve(response)
              else reject(new Error(i18n.__('superUserCreateError')))
            })
            .catch((err) => {
              err.message = i18n.__('superUserCreateError')
              reject(err)
            })
        })
        .catch((error) => {
          // error.message = i18n.__('userCreateError')
          reject(error)
        })
    })
  }

  //override
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await SuperUserModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('superUserUpdateError')))
        })
        .catch((err) => {
          err.message = i18n.__('superUserUpdateError')
          reject(err)
        })
    })
  }

  //override
  delete(id) {
    return new Promise((resolve, reject) => {
      SuperUserModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('superUserDeleteError')))
        })
        .catch((err) => {
          err.message = i18n.__('superUserDeleteError')
          reject(err)
        })
    })
  }

  list(where) {
    return new Promise((resolve, reject) => {
      SuperUserModel.find(where)
        .populate('user')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('superUserListError')))
        })
        .catch((error) => {
          error.message = i18n.__('superUserListError')
          reject(error)
        })
    })
  }

  //override
  findOne(where) {
    return new Promise((resolve, reject) => {
      SuperUserModel.findOne(where)
        .populate('user')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('superUserNotFound')))
        })
        .catch((err) => {
          err.message = i18n.__('superUserNotFound')
          reject(err)
        })
    })
  }
}

module.exports = new SuperUsers()
