const express = require('express')
const router = express.Router()
const { store, index, show, update, destroy } = require('../controllers/WalletController')
const validate = require('../middlewares/validate')
const idchecker = require('../middlewares/idchecker')
const authenticateToken = require('../middlewares/authenticate')
const schemas = require('../validations/Wallet')
const checkVersion = require('../middlewares/checkVersion')

router.route('/').post(authenticateToken, checkVersion, validate(schemas.createValidation), store)
router.route('/').get(authenticateToken, checkVersion, index)
router.route('/:id').get(authenticateToken, checkVersion, idchecker, show)
router.route('/:id').patch(authenticateToken, checkVersion, idchecker, validate(schemas.updateValidation), update)
router.route('/:id').delete(authenticateToken, checkVersion, idchecker, destroy)

module.exports = router
