const httpStatus = require('http-status')
const { createPasswordToHash, generateAccessToken, generateRefreshToken } = require('../scripts/utils/auth')
const UserService = require('../services/Users')
const MemberService = require('../services/Members')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const store = async (req, res, next) => {
  await UserService.create(req.body)
    .then(async (response) => {
      await MemberService.create({ ...req.body, user: response._id })
        .then((response) => {
          const user = {
            ...response.toObject(),
          }
          delete user.password
          res.status(httpStatus.CREATED).send(user)
        })
        .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const login = async (req, res, next) => {
  req.body.password = createPasswordToHash(req.body.password)
  await MemberService.findOne(req.body)
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
  store,
  login,
}
