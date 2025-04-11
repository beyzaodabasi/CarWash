const BaseService = require('./BaseService')
const WalletModel = require('../models/Wallet')
const i18n = require('../config/translate')

class Wallets extends BaseService {
  constructor() {
    super(WalletModel)
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      await WalletModel.create(data)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('walletCreateError')))
        })
        .catch((error) => {
          error.message = i18n.__('walletCreateError')
          reject(error)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await WalletModel.findOne(where)
        .populate('transactions')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('walletNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('walletNotFound')
          reject(error)
        })
    })
  }

  list(where) {
    return new Promise(async (resolve, reject) => {
      await WalletModel.find(where)
        // .populate('transactions')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('walletListError')))
        })
        .catch((error) => {
          error.message = i18n.__('walletListError')
          reject(error)
        })
    })
  }

  update(id, data) {
    data.updated_date = new Date(Date.now() + 10800000)
    return new Promise(async (resolve, reject) => {
      await WalletModel.findByIdAndUpdate(id, data, { new: true })
        .populate('transactions')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('walletUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('walletUpdateError')
          reject(error)
        })
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      WalletModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('walletDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('walletDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Wallets()
