const express = require('express')
const router = express.Router()
const { store, login } = require('../controllers/MemberController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/Member')
const checkVersion = require('../middlewares/checkVersion')

router.route('/login').post(authenticateToken, checkVersion, validate(schemas.loginValidation), login)
router.route('/').post(authenticateToken, checkVersion, validate(schemas.createValidation), store)

module.exports = router
