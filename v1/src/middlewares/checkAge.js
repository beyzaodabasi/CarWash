const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const checkAge = (req, res, next) => {
  const { birthDate } = req.body
  const today = new Date()
  const birthDateObj = new Date(birthDate)
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }
  if (age < 18) {
    return next(new ApiError(i18n.__('memberCreateAgeLimitError')))
  }
  next()
}

module.exports = checkAge
