const httpStatus = require('http-status')
const { createPasswordToHash, generateAccessToken, generateRefreshToken } = require('../scripts/utils/auth')
const UserService = require('../services/Users')
const MemberService = require('../services/Members')
const StaffService = require('../services/Staffs')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'TENANT' || req.user.userType === 'MEMBER') {
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
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const show = async (req, res, next) => {
  if (req.user.userType === 'TENANT' || req.user.userType === 'MEMBER') {
    await UserService.findOne({
      _id: req.params.id,
    })
      .then((response) => {
        const user = response.toObject()
        delete user.password
        return res.status(httpStatus.OK).send(user)
      })
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const store = async (req, res, next) => {
  console.log('req.user', req.user.userType)
  if (req.user.userType === 'TENANT') {
    if (req.body.password) {
      req.body.password = createPasswordToHash(req.body.password)
    }

    await UserService.create(req.body)
      .then(async (response) => {
        if (req.body.userType === 'MEMBER') {
          await MemberService.create({ ...req.body, user: response._id })
            .then((response) => {
              const user = {
                ...response.toObject(),
              }
              delete user.password
              res.status(httpStatus.CREATED).send(user)
            })
            .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
        } else if (req.body.userType === 'STAFF') {
          await StaffService.create({ ...req.body, user: response._id })
            .then((response) => {
              const user = {
                ...response.toObject(),
              }
              delete user.password
              res.status(httpStatus.CREATED).send(user)
            })
            .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
        }
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

  if (req.body.password) {
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
      if (response.userType === 'MEMBER') {
        MemberService.findOne({ user: response._id })
          .then((response) => {
            const user = {
              ...response.toObject(),
              accessToken: generateAccessToken(response.user.toObject()),
              refreshToken: generateRefreshToken(response.user.toObject()),
            }
            delete user.password
            delete user.user.password
            return res.status(httpStatus.OK).send(user)
          })
          .catch((error) => next(new ApiError(error.message, httpStatus.UNAUTHORIZED)))
      } else if (response.userType === 'STAFF') {
        StaffService.findOne({ user: response._id })
          .then((response) => {
            const user = {
              ...response.toObject(),
              accessToken: generateAccessToken(response.user.toObject()),
              refreshToken: generateRefreshToken(response.user.toObject()),
            }
            delete user.password
            delete user.user.password
            return res.status(httpStatus.OK).send(user)
          })
          .catch((error) => next(new ApiError(error.message, httpStatus.UNAUTHORIZED)))
      } else if (response.userType === 'TENANT') {
        const user = {
          ...response.toObject(),
          accessToken: generateAccessToken(response.toObject()),
          refreshToken: generateRefreshToken(response.toObject()),
        }
        delete user.password
        return res.status(httpStatus.OK).send(user)
      } else {
        next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
      }
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
