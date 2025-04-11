const httpStatus = require('http-status')
const { createPasswordToHash } = require('../scripts/utils/auth')
const SuperUserService = require('../services/SuperUsers')
const UserService = require('../services/Users')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  await SuperUserService.list()
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
}

const show = async (req, res, next) => {
  await SuperUserService.findOne({ _id: req.params.id })
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.NO_CONTENT)))
}

const store = async (req, res, next) => {
  req.body.password = createPasswordToHash(req.body.password)
  req.body.version = req.headers['version']
  await SuperUserService.create(req.body)
    .then((superUser) => {
      return res.status(httpStatus.OK).send(superUser)
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.BAD_REQUEST))
    })
}

const update = async (req, res, next) => {
  if (req.user.userType != 'SUPERUSER') return next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))

  const localTime = new Date(Date.now() + 10800000)
  req.body.updated_date = localTime

  if (req?.body?.password) req.body.password = createPasswordToHash(req.body.password)

  await SuperUserService.update(req.params.id, req.body)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const destroy = async (req, res, next) => {
  if (req.user.userType != 'SUPERUSER') return next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  await SuperUserService.delete(req.params.id)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
}
