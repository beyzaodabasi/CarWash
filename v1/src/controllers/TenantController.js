const httpStatus = require('http-status')
const { createPasswordToHash } = require('../scripts/utils/auth')
const UserService = require('../services/Users')
const TenantService = require('../services/Tenants')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await TenantService.list()
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const show = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await TenantService.findOne({ _id: req.params.id })
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.NO_CONTENT)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const store = async (req, res, next) => {
  const email = req.body.email

  await UserService.create({
    name: `${req.body.firstName} ${req.body.lastName}`,
    email: email,
    password: createPasswordToHash(req.body.password),
    gsm: req.body.gsm,
    userName: req.body.userName,
    city: req.body.city,
    town: req.body.town,
    userType: 'TENANT',
    version: req.headers['version'],
  })
    .then(async (user) => {
      req.body.users = [user]
      await TenantService.create(req.body)
        .then((tenant) => {
          user.tenant = tenant._id
          user.version = req.headers['version']
          user.save()
          return res.status(httpStatus.OK).send(tenant)
        })
        .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const update = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    const localTime = new Date(Date.now() + 10800000)
    req.body.updated_date = localTime

    await TenantService.update(req.params.id, req.body)
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const destroy = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await TenantService.delete(req.params.id)
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
}
