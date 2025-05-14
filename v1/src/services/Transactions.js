const BaseService = require('./BaseService')
const TransactionModel = require('../models/Transaction')
const i18n = require('../config/translate')

class Transactions extends BaseService {
  constructor() {
    super(TransactionModel)
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      await TransactionModel.create(data)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('transactionCreateError')))
        })
        .catch((error) => {
          error.message = i18n.__('transactionCreateError')
          reject(error)
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await TransactionModel.findOne(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('transactionNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('transactionNotFound')
          reject(error)
        })
    })
  }

  list(where) {
    return new Promise((resolve, reject) => {
      TransactionModel.find(where)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('transactionListError')))
        })
        .catch((error) => {
          error.message = i18n.__('transactionListError')
          reject(error)
        })
    })
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await TransactionModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('transactionUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('transactionUpdateError')
          reject(error)
        })
    })
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      await TransactionModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('transactionDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('transactionDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Transactions()
