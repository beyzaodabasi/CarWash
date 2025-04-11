const httpStatus = require('http-status')
const UserService = require('../services/Users')
const NotificationService = require('../services/Notifications')
const { Expo } = require('expo-server-sdk')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const store = async (req, res, next) => {
  const title = req.body.title
  const priority = req.body.priority || 'high'
  const message = req.body.message
  const notificationType = 'global'

  await UserService.list({ pushToken: { $ne: null } })
    .then(async (users) => {
      if (!users || users.length == 0) return next(new ApiError(i18n.__('userListError'), httpStatus.NOT_FOUND))

      let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

      const messageTemplate = {
        to: '',
        title,
        body: message,
        priority,
        sound: 'default',
        badge: 1,
      }

      const messages = []
      const validTokens = []
      const sendSuccess = []
      const sendError = []

      for await (const USER of users) {
        const pushToken = USER.pushToken
        if (Expo.isExpoPushToken(pushToken)) {
          validTokens.push(pushToken)
          messages.push({ ...messageTemplate, to: pushToken })
        } else {
          await UserService.update(USER._id, { pushToken: null })
            .then((updatedUser) => {})
            .catch((err) => {})
        }
      }

      const chunks = expo.chunkPushNotifications(messages)

      for await (const CHUNK of chunks) {
        await expo
          .sendPushNotificationsAsync(CHUNK)
          .then((tickets) => {
            tickets.forEach((ticket) => {
              if (ticket.status == 'ok') sendSuccess.push(ticket)
              else sendError.push(ticket)
            })
          })
          .catch((error) => {
            console.log('err', error)
            sendError.push(error.message)
          })
      }

      await NotificationService.create({
        title,
        body: message,
        notificationType,
        successedCount: sendSuccess.length,
        failedCount: sendError.length,
      })
        .then((response) => res.status(httpStatus.OK).send(response))
        .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.BAD_REQUEST))
    })
}

const storeByUser = async (req, res, next) => {
  const userId = req.params.id
  const title = req.body.title
  const priority = req.body.priority || 'high'
  const message = req.body.message
  const notificationType = 'user'

  await UserService.findOne({ _id: userId, pushToken: { $ne: null } })
    .then(async (user) => {
      if (!user) return next(new ApiError(i18n.__('userListError'), httpStatus.NOT_FOUND))

      let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

      const messageTemplate = {
        to: '',
        title,
        body: message,
        priority,
        sound: 'default',
        badge: 1,
      }

      const messages = []
      const validTokens = []
      const sendSuccess = []
      const sendError = []

      const pushToken = user.pushToken
      if (Expo.isExpoPushToken(pushToken)) {
        validTokens.push(pushToken)
        messages.push({ ...messageTemplate, to: pushToken })
      }

      const chunks = expo.chunkPushNotifications(messages)

      for await (const CHUNK of chunks) {
        await expo
          .sendPushNotificationsAsync(CHUNK)
          .then((tickets) => {
            tickets.forEach((ticket) => {
              if (ticket.status == 'ok') sendSuccess.push(ticket)
              else sendError.push(ticket)
            })
          })
          .catch((error) => {
            console.log('err', error)
            sendError.push(error.message)
          })
      }

      await NotificationService.create({
        title,
        body: message,
        notificationType,
        userId,
        successedCount: sendSuccess.length,
        failedCount: sendError.length,
      })
        .then((response) => res.status(httpStatus.OK).send(response))
        .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

module.exports = {
  store,
  storeByUser,
}
