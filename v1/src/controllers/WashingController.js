const httpStatus = require('http-status')
const WashingService = require('../services/Washings')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await WashingService.list({ tenant: req.user?.tenant })
      .then((response) => {
        res.status(httpStatus.OK).send(response)
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else if (req.user.userType === 'SUPERUSER') {
    await WashingService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response)
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const store = async (req, res, next) => {
  req.body.version = req.headers['version']
  await WashingService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response)
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.BAD_REQUEST))
    })
}

const show = async (req, res, next) => {
  await WashingService.findOne({ _id: req.params.id })
    .then((response) => {
      res.status(httpStatus.OK).send(response)
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.NOT_FOUND))
    })
}

const update = async (req, res, next) => {
  const localTime = new Date(Date.now() + 10800000)
  req.body.updated_date = localTime
  req.body.version = req.headers['version']

  await WashingService.update(req.params.id, req.body)
    .then((response) => {
      res.status(httpStatus.OK).send(response)
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.BAD_REQUEST))
    })
}

const destroy = async (req, res, next) => {
  await WashingService.delete(req.params.id)
    .then(() => {
      res.status(httpStatus.OK).send()
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.BAD_REQUEST))
    })
}

module.exports = {
  index,
  store,
  show,
  update,
  destroy,
}
