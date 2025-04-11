const express = require('express')
const router = express.Router()
const { store, login, index, show, update, destroy } = require('../controllers/MemberController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/Member')
const checkVersion = require('../middlewares/checkVersion')

router.route('/login').post(checkVersion, validate(schemas.loginValidation), login)
router.route('/').get(authenticateToken, checkVersion, index)
router.route('/').post(checkVersion, validate(schemas.createValidation), store)
router.route('/:id').get(checkVersion, idchecker, show)
router.route('/:id').patch(checkVersion, idchecker, validate(schemas.updateValidation), update)
router.route('/:id').delete(authenticateToken, checkVersion, idchecker, destroy)

module.exports = router
