const BaseService = require('./BaseService')
const TenantModel = require('../models/Tenant')
const i18n = require('../config/translate')

class Tenants extends BaseService {
  constructor() {
    super(TenantModel)
  }

  //override
  create(data) {
    return new Promise((resolve, reject) => {
      TenantModel.create(data)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('tenantCreateError')))
        })
        .catch((err) => {
          err.message = i18n.__('tenantCreateError')
          reject(err)
        })
    })
  }

  //override
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await TenantModel.findByIdAndUpdate(id, data)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('tenantUpdateError')))
        })
        .catch((err) => {
          err.message = i18n.__('tenantUpdateError')
          reject(err)
        })
    })
  }

  //override
  delete(id) {
    return new Promise((resolve, reject) => {
      TenantModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('tenantDeleteError')))
        })
        .catch((err) => {
          err.message = i18n.__('tenantDeleteError')
          reject(err)
        })
    })
  }

  list(where) {
    return new Promise((resolve, reject) => {
      TenantModel.find(where)
        .populate('users')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('tenantNotFound')))
        })
        .catch((err) => {
          err.message = i18n.__('tenantNotFound')
          reject(err)
        })
    })
  }

  //override
  findOne(where) {
    return new Promise((resolve, reject) => {
      TenantModel.findOne(where)
        .populate('users')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('tenantNotFound')))
        })
        .catch((err) => {
          err.message = i18n.__('tenantNotFound')
          reject(err)
        })
    })
  }
}

module.exports = new Tenants()
