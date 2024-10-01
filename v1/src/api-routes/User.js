const express = require('express')
const router = express.Router()
const { index, show, store, update, destroy, login } = require('../controllers/UserController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/User')
const checkVersion = require('../middlewares/checkVersion')

router.route('/login').post(checkVersion, validate(schemas.loginValidation), login)
router.route('/').get(authenticateToken, checkVersion, index)
router.route('/:id').get(authenticateToken, checkVersion, idchecker, show)
router.route('/').post(authenticateToken, checkVersion, validate(schemas.createValidation), store)
router.route('/:id').patch(idchecker, authenticateToken, checkVersion, validate(schemas.updateValidation), update)
router.route('/:id').delete(authenticateToken, checkVersion, idchecker, destroy)

module.exports = router
