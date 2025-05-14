const CryptoJS = require('crypto-js')
const httpStatus = require('http-status')
const i18n = require('../config/translate')
const ApiError = require('../errors/ApiError')

const hashCompare = async (req, res, next) => {
  // backend tarafında tanımlı olan signature değerini alıyoruz.
  const signature = process.env.APP_SIGNATURE
  // gelen istek içinden tenant, gsm ve dateTime verileri ve bu verilerin hashlenmiş halini alıyoruz.
  const data = `${req.body.tenant}${req.body.gsm}${req.body.dateTime}`
  // gelen istek içinden gelen hash değerini alıyoruz.
  const hash = req.body.hash
  const hashData = CryptoJS.HmacSHA256(CryptoJS.HmacSHA1(data, signature).toString(), signature).toString()

  // console.log('hashData: ', hashData)
  // gelen hash ile backend tarafında oluşturulan hash değerini karşılaştırıyoruz.
  if (hashData == hash) {
    // eğer hash değerleri eşleşiyorsa isteği devam ettiriyoruz.
    next()
  } else {
    // eğer hash değerleri eşleşmiyorsa hata dönüyoruz.
    return next(new ApiError(i18n.__('hashCompareUnMatchedError'), httpStatus.UNAUTHORIZED))
  }
}

module.exports = hashCompare
