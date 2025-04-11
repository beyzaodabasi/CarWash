const httpStatus = require('http-status')
const { createPasswordToHash, generateAccessToken, generateRefreshToken } = require('../scripts/utils/auth')
const UserService = require('../services/Users')
const MemberService = require('../services/Members')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await MemberService.list({ tenant: req.user?.tenant })
      .then((response) => {
        res.status(httpStatus.OK).send(
          response.map((u) => {
            const user = u.toObject()
            delete user.user.password
            return user
          })
        )
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else if (req.user.userType === 'SUPERUSER') {
    await MemberService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(
          response.map((u) => {
            const user = u.toObject()
            delete user.user.password
            return user
          })
        )
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const store = async (req, res, next) => {
  req.body.password = createPasswordToHash(`*!wsh*!${req.body.gsm}*!5858*!`)
  req.body.version = req.headers['version']
  await MemberService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response)
    })
    .catch((error) => {
      next(new ApiError(error.message, httpStatus.BAD_REQUEST))
    })
}

const login = async (req, res, next) => {
  req.body.password = createPasswordToHash(req.body.password)
  const data = {
    tenant: req.body.tenant,
    gsm: req.body.gsm,
  }
  await MemberService.findOne(data)
    .then((response) => {
      if (response.user.password == req.body.password) {
        const user = {
          ...response.toObject(),
          accessToken: generateAccessToken(response.toObject()),
          refreshToken: generateRefreshToken(response.toObject()),
        }
        delete user.user.password
        res.status(httpStatus.OK).send(user)
      } else {
        next(new ApiError(i18n.__('memberNotFound'), httpStatus.UNAUTHORIZED))
      }
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.UNAUTHORIZED)))
}

const show = async (req, res, next) => {
  await MemberService.findOne({ _id: req.params.id })
    .then((response) => {
      const user = response.toObject()
      delete user.user.password
      res.status(httpStatus.OK).send(user)
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
}

const update = async (req, res, next) => {
  const localTime = new Date(Date.now() + 10800000)
  req.body.updated_date = localTime
  req.body.version = req.headers['version']

  await MemberService.update(req.params.id, req.body)
    .then((response) => {
      res.status(httpStatus.OK).send(response)
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const destroy = async (req, res, next) => {
  await MemberService.delete(req.params.id)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

module.exports = {
  index,
  store,
  login,
  show,
  update,
  destroy,
}
