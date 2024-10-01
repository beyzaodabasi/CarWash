const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const idchecker = (req, res, next) => {
  if (!req?.params?.id?.match(/^[0-9a-f-A-F]{24}$/)) {
    return next(new ApiError(i18n.__('invalidId')))
  }
  next()
}

module.exports = idchecker
