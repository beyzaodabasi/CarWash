const httpStatus = require('http-status')
const { createPasswordToHash, generateAccessToken, generateRefreshToken } = require('../scripts/utils/auth')
const UserService = require('../services/Users')
const MemberService = require('../services/Members')
const StaffService = require('../services/Staffs')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await UserService.list({ tenant: req.user?.tenant })
      .then((response) => {
        res.status(httpStatus.OK).send(
          response.map((u) => {
            const user = u.toObject()
            delete user.password
            return user
          })
        )
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else if (req.user.userType === 'SUPERUSER') {
    await UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(
          response.map((u) => {
            const user = u.toObject()
            delete user.password
            return user
          })
        )
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const show = async (req, res, next) => {
  await UserService.findOne({ _id: req.params.id })
    .then((response) => {
      const user = response.toObject()
      delete user.password
      res.status(httpStatus.OK).send(user)
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
}

const store = async (req, res, next) => {
  if (req.user.userType === 'TENANT' || req.user.userType === 'SUPERUSER') {
    if (req.body.password) {
      req.body.password = createPasswordToHash(req.body.password)
    }

    await UserService.create(req.body)
      .then(async (response) => {
        const user = response.toObject()
        delete user.password
        res.status(httpStatus.OK).send(user)
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const update = async (req, res, next) => {
  const localTime = new Date(Date.now() + 10800000)
  req.body.updated_date = localTime
  req.body.version = req.headers['version']

  if (req?.body?.password) {
    req.body.password = createPasswordToHash(req.body.password)
  }

  await UserService.update(req.params.id, req.body)
    .then((response) => {
      const user = response.toObject()
      delete user.password
      res.status(httpStatus.OK).send(user)
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const destroy = async (req, res, next) => {
  await UserService.delete(req.params.id)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const login = async (req, res, next) => {
  req.body.password = createPasswordToHash(req.body.password)
  await UserService.findOne(req.body)
    .then((response) => {
      const user = {
        ...response.toObject(),
        accessToken: generateAccessToken(response.toObject()),
        refreshToken: generateRefreshToken(response.toObject()),
      }
      delete user.password
      res.status(httpStatus.OK).send(user)
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.UNAUTHORIZED)))
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  login,
}
