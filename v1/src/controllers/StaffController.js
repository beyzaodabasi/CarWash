const httpStatus = require('http-status')
const UserService = require('../services/Users')
const StaffService = require('../services/Staffs')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const store = async (req, res, next) => {
  await UserService.create(req.body)
    .then(async (response) => {
      await StaffService.create({ ...req.body, user: response._id })
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

module.exports = {
  store,
}
