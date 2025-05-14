const httpStatus = require('http-status')
const SupportService = require('../services/Supports')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'SUPERUSER') {
    await SupportService.list()
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    await SupportService.list({ tenant: req.user?.tenant })
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  }
}

const store = async (req, res, next) => {
  console.log("req.user", req)
  req.body.version = req.headers['version']
  await SupportService.create(req.body)
    .then((response) => res.status(httpStatus.CREATED).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const show = async (req, res, next) => {
  await SupportService.findOne({ _id: req.params.id })
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
}

const update = async (req, res, next) => {
  console.log('req.staff', req.staff)
  const localTime = new Date(Date.now() + 10800000)
  req.body.updated_date = localTime
  req.body.finishedStaff = req.staff?._id
  await SupportService.update(req.params.id, req.body)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const destroy = async (req, res, next) => {
  await SupportService.delete(req.params.id)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

module.exports = {
  index,
  store,
  show,
  update,
  destroy,
}
