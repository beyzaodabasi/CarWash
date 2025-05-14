const express = require('express')
const router = express.Router()
const { store, index, show, update, destroy } = require('../controllers/StaffController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/Staff')
const checkVersion = require('../middlewares/checkVersion')
const checkAge = require('../middlewares/checkAge')

router.route('/').post(authenticateToken, checkVersion, validate(schemas.createValidation), checkAge, store)
router.route('/').get(authenticateToken, checkVersion, index)
router.route('/:id').get(checkVersion, idchecker, show)
router.route('/:id').patch(checkVersion, idchecker, validate(schemas.updateValidation), update)
router.route('/:id').delete(checkVersion, idchecker, destroy)


module.exports = router
