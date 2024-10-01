const express = require('express')
const router = express.Router()
const { store } = require('../controllers/StaffController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/Staff')
const checkVersion = require('../middlewares/checkVersion')

router.route('/').post(authenticateToken, checkVersion, validate(schemas.createValidation), store)

module.exports = router