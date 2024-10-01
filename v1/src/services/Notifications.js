const BaseService = require('./BaseService')
const NotificationModel = require('../models/Notification')
const i18n = require('../config/translate')
const Notification = require('../models/Notification')

class Notifications extends BaseService {
  constructor() {
    super(NotificationModel)
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      await NotificationModel.create(data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }
}

module.exports = new Notifications()
