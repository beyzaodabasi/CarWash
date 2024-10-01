const express = require('express')
const router = express.Router()
const { store, storeByUser } = require('../controllers/NotificationController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/Notification')
const checkVersion = require('../middlewares/checkVersion')

router.route('/').post(authenticateToken, validate(schemas.sendNotificationValidation), checkVersion, store)
router.route('/user/:id').post(authenticateToken, idchecker, validate(schemas.sendByUserNotificationValidation), checkVersion, storeByUser)

module.exports = router
