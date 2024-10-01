const httpStatus = require('http-status')

module.exports = (error, req, res, next) => {
  if (error.message.includes('E11000')) {
    res.status(httpStatus.CONFLICT).send({
      code: httpStatus.CONFLICT,
      message: 'Bu kayıt veritabanında zaten var.',
    })
  }
  res.status(error.status || 500).send({
    error: {
      code: error.status || 500,
      message: error.message || 'Internal Server Error...',
    },
  })
}
