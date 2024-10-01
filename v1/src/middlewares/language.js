const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const language = (req, res, next) => {
  if (req.headers['language']) {
    i18n.setLocale(req.headers['language'].toLowerCase().substring(0, 2))
    next()
  } else {
    next(new ApiError(i18n.__('missing_language')), 500)
  }
}

module.exports = language
