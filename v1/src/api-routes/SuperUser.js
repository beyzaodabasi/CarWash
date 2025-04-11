const express = require('express')
const router = express.Router()
const { index, show, store, update, destroy } = require('../controllers/SuperUserController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const schemas = require('../validations/SuperUser')
const authenticateToken = require('../middlewares/authenticate')
const checkVersion = require('../middlewares/checkVersion')

router.route('/').get(authenticateToken, checkVersion, index)
router.route('/').post(validate(schemas.createValidation), checkVersion, store)
router.route('/:id').get(idchecker, authenticateToken, show)
router.route('/:id').patch(idchecker, authenticateToken, validate(schemas.updateValidation), checkVersion, update)
router.route('/:id').delete(idchecker, authenticateToken, checkVersion, destroy)

module.exports = router
