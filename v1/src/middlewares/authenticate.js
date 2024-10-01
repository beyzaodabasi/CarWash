const JWT = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || null
  if (token === null) {
    return next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }

  JWT.verify(token, process.env.APP_ACCESS_TOKEN_HASH, async (err, user) => {
    if (err) {
      return next(new ApiError(`${i18n.__('tokenMalformed')} ${err.message}`, httpStatus.UNAUTHORIZED))
    }

    req.user = user

    // console.log('USER: (authenticate)', user)
    // if (user.user_type == 'MEMBER') {
    //   await MemberService.findOne({ user: user._id })
    //     .then((member) => {
    //       req.member = member
    //     })
    //     .catch((err) => next(new ApiError(err.message, httpStatus.UNAUTHORIZED)))
    // } else if (user.user_type == 'STAFF') {
    //   await StaffService.findOne({ user: user._id })
    //     .then((staff) => {
    //       req.staff = staff
    //     })
    //     .catch((err) => next(new ApiError(err.message, httpStatus.UNAUTHORIZED)))
    // } else if (user.user_type == 'TENANT') {
    //   await TenantService.findOne({ _id: user.tenant })
    //     .then((tenant) => {
    //       req.tenant = tenant
    //     })
    //     .catch((err) => next(new ApiError(err.message, httpStatus.UNAUTHORIZED)))
    // } else if (user.user_type == 'MERCHANT') {
    //   await MerchantService.findOne({ user: user._id })
    //     .then((merchant) => {
    //       req.merchant = merchant
    //     })
    //     .catch((err) => next(new ApiError(err.message, httpStatus.UNAUTHORIZED)))
    // } else {
    //   return next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
    // }
    next()
  })
}

module.exports = authenticateToken
