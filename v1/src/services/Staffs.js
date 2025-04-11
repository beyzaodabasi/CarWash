const BaseService = require('./BaseService')
const StaffModel = require('../models/Staff')
const UserService = require('./Users')
const WalletService = require('./Wallets')
const uploadImage = require('../scripts/uploadImage')
const moment = require('moment')
const soap = require('soap')
const i18n = require('../config/translate')

class Staffs extends BaseService {
  constructor() {
    super(StaffModel)
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      const address = 'https://tckimlik.nvi.gov.tr/service/kpspublic.asmx?WSDL'
      let year = moment(data.birthDate).format('YYYY')
      let test = new Date(data.birthDate)
      let diff_ms = Date.now() - test.getTime()
      var age_dt = new Date(diff_ms)
      var age = Math.abs(age_dt.getUTCFullYear() - 1970)

      await StaffModel.findOne({ tckn: data.tckn })
        .then(async (response) => {
          if (response) return reject(new Error(i18n.__('staffCreateTcknError')))
          else {
            const userData = {
              tenant: data.tenant,
              email: data.email,
              password: data.password,
              name: `${data.firstName} ${data.lastName}`,
              gsm: data.gsm,
              city: data?.city,
              town: data?.town,
              userType: 'STAFF',
              active: true,
              version: data.version,
            }

            const file = {
              base64Data: data.base64drivingLicenseImage,
            }
            await uploadImage(file)
              .then(async (response) => {
                data.drivingLicenseImage = {
                  key: response.key,
                  url: response.path,
                }
                if (data.otherNationality == true) {
                  // Yabancı uyruklu ise
                  if (age >= 18) {
                    await UserService.create(userData)
                      .then(async (user) => {
                        data.user = user._id
                        await StaffModel.create(data)
                          .then(async (staff) => {
                            const walletData = {
                              tenant: data.tenant,
                              user: user._id,
                              name: `${data.firstName} ${data.lastName}`,
                              balance: 0,
                              version: data.version,
                            }
                            await WalletService.create(walletData)
                              .then((wallet) => {
                                staff.wallet = wallet._id
                                staff.save()
                                return resolve(staff)
                              })
                              .catch((error) => {
                                return reject(new Error(error.message))
                              })
                          })
                          .catch((error) => {
                            return reject(new Error(error.message))
                          })
                      })
                      .catch((error) => {
                        return reject(new Error(error.message))
                      })
                  } else {
                    return reject(new Error(i18n.__('staffCreateAgeLimitError')))
                  }
                } else if (data.otherNationality == false) {
                  // Türk uyruklu ise
                  await soap.createClient(address, async (err, client) => {
                    let degerler = {
                      TCKimlikNo: data.tckn,
                      Ad: data.firstName,
                      Soyad: data.lastName,
                      DogumYili: year,
                    }
                    await client.TCKimlikNoDogrula(degerler, async (err, result) => {
                      if (result.TCKimlikNoDogrulaResult && age >= 18) {
                        await UserService.create(userData)
                          .then(async (user) => {
                            data.user = user._id
                            await StaffModel.create(data)
                              .then(async (staff) => {
                                const walletData = {
                                  tenant: data.tenant,
                                  user: user._id,
                                  name: `${data.firstName} ${data.lastName}`,
                                  balance: 0,
                                  version: data.version,
                                }
                                await WalletService.create(walletData)
                                  .then((wallet) => {
                                    staff.wallet = wallet._id
                                    staff.save()
                                    return resolve(staff)
                                  })
                                  .catch((error) => {
                                    return reject(new Error(i18n.__('walletCreateError')))
                                  })
                              })
                              .catch((error) => {
                                return reject(new Error(error.message))
                              })
                          })
                          .catch((error) => {
                            return reject(new Error(error.message))
                          })
                      } else if (age < 18) {
                        return reject(new Error(i18n.__('staffCreateAgeLimitError')))
                      } else {
                        return reject(new Error(i18n.__('staffCreateError')))
                      }
                    })
                  })
                } else {
                  return reject(new Error(i18n.__('staffCreateError')))
                }
              })
              .catch((error) => {
                return reject(new Error(i18n.__('staffCreateImageError')))
              })
          }
        })
        .catch((error) => {
          return reject(new Error(error.message))
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await StaffModel.findOne(where)
        .populate('user')
        .populate('wallet')
        .populate('tenant')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('staffNotFound')
          reject(error)
        })
    })
  }

  // override
  list(where) {
    return new Promise((resolve, reject) => {
      StaffModel.find(where)
        .populate('user')
        .populate('wallet')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffListError')))
        })
        .catch((error) => {
          error.message = i18n.__('staffListError')
          reject(error)
        })
    })
  }

  // override update
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await StaffModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('staffUpdateError')
          reject(error)
        })
    })
  }

  // override delete
  delete(id) {
    return new Promise(async (resolve, reject) => {
      await StaffModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('staffDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('staffDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Staffs()
