const httpStatus = require('http-status')
const i18n = require('../config/translate')

const TenantService = require('../services/Tenants')

const checkVersion = async (req, res, next) => {
  // [EN] Algorithm:
  // in tenant model we have an array field called version
  // if we cant find a tenant with the version we got from the request
  // we will return an error for the client to update the app from the store (play store or app store)
  // if we find a tenant with the version we got from the request
  // we will continue to the next middleware

  // [TR] Algoritma:
  // tenant modelinde version adında bir array field var
  // eğer istekten gelen versiyonu içeren bir tenant bulamazsak
  // istemciye uygulamayı güncellemesi için bir hata döndüreceğiz (play store veya app store)
  // eğer istekten gelen versiyonu içeren bir tenant bulursak
  // bir sonraki middleware'e devam edeceğiz

  // Getting version value from request[EN]
  // İstekten versiyon değerini alıyoruz[TR]
  const version = req.headers['version'] //  req.headers.version

  // Hata mesajını i18n ile çekiyoruz[TR]
  // Getting error message with i18n[EN]
  const errorMessage = i18n.__('versionNotMatched')

  // get first 5 letter in version for check if it is panel or staff[EN]
  // versiyonun ilk 5 harfini alıyoruz eğer panel veya staff ise devam ediyoruz[TR]
  const versionFirst5 = version.substring(0, 5)
  if (versionFirst5 == 'panel' || versionFirst5 == 'staff') return next()

  // Checking if we can find a tenant with the version we got from the request[EN]
  // İstekten gelen versiyonu içeren bir tenant bulup bulamayacağımızı kontrol ediyoruz[TR]
  // If we cant find a tenant with the version we got from the request, then request sending from old version[EN]
  // Eğer istekten gelen versiyonu içeren bir tenant bulamazsak, istek eski versiyondan gönderiliyor demektir[TR]
  await TenantService.findOne({ version: { $in: [version] } })
    .then((tenant) => {
      // If we find a tenant with the version we got from the request, then request sending from new version[EN]
      // Eğer istekten gelen versiyonu içeren bir tenant bulursak, istek yeni versiyondan gönderiliyor demektir[TR]
      if (tenant) next()
      else {
        // If we cant find then request sending from old version[EN]
        // Eğer bulamazsak istek eski versiyondan gönderiliyor demektir[TR]
        const error = new Error(errorMessage)
        error.status = httpStatus.UPGRADE_REQUIRED
        return next(error)
      }
    })
    .catch((err) => {
      // If we cant find then request sending from old version[EN]
      // Eğer bulamazsak istek eski versiyondan gönderiliyor demektir[TR]
      const error = new Error(errorMessage)
      error.status = httpStatus.UPGRADE_REQUIRED
      return next(error)
    })
}

module.exports = checkVersion
