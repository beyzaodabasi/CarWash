const BaseService = require('./BaseService')
const MemberModel = require('../models/Member')
const UserService = require('./Users')
const WalletService = require('./Wallets')
const moment = require('moment')
const soap = require('soap')
const auth = require('../scripts/utils/auth')
const i18n = require('../config/translate')

class Members extends BaseService {
  constructor() {
    super(MemberModel)
  }

  create(data) {
    const localTime = new Date(Date.now() + 10800000)
    return new Promise(async (resolve, reject) => {
      if (data.gsm[0] == '0') {
        return reject(new Error(i18n.__('memberGsm0Error')))
      }
      const address = 'https://tckimlik.nvi.gov.tr/service/kpspublic.asmx?WSDL'
      const addressYbnc = 'https://tckimlik.nvi.gov.tr/yabanciKimlikNoDogrula/search'
      let year = moment(data.birthDate).format('YYYY')
      let test = new Date(data.birthDate)
      let diff_ms = Date.now() - test.getTime()
      var age_dt = new Date(diff_ms)
      var age = Math.abs(age_dt.getUTCFullYear() - 1970)

      await MemberModel.findOne({ tckn: data.tckn })
        .then(async (response) => {
          if (response) return reject(new Error(i18n.__('memberCreateTcknError')))
          else {
            const userData = {
              tenant: data.tenant,
              email: data.email,
              password: data.password,
              name: `${data.firstName} ${data.lastName}`,
              gsm: data.gsm,
              city: data?.city,
              town: data?.town,
              userType: 'MEMBER',
              active: true,
              version: data.version,
            }
            // Yabancı uyruklu ise
            if (data.otherNationality == true) {
              if (age >= 18) {
                await UserService.create(userData)
                  .then(async (user) => {
                    data.user = user._id
                    await MemberModel.create(data)
                      .then(async (member) => {
                        const walletData = {
                          tenant: data.tenant,
                          user: user._id,
                          name: `${data.firstName} ${data.lastName}`,
                          balance: 0,
                          version: data.version,
                        }
                        await WalletService.create(walletData)
                          .then((wallet) => {
                            member.wallet = wallet._id
                            member.save()
                            return resolve(member)
                          })
                          .catch((error) => {
                            return reject(new Error(i18n.__('walletCreateError')))
                          })
                      })
                      .catch((error) => {
                        return reject(new Error(i18n.__('memberCreateError')))
                      })
                  })
                  .catch((error) => {
                    return reject(new Error(error.message))
                  })
              } else {
                return reject(new Error(i18n.__('memberCreateAgeLimitError')))
              }
            } else if (data.otherNationality == false) {
              // Türk vatandaşı ise
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
                        await MemberModel.create(data)
                          .then(async (member) => {
                            const walletData = {
                              tenant: data.tenant,
                              user: user._id,
                              name: `${data.firstName} ${data.lastName}`,
                              balance: 0,
                              version: data.version,
                            }
                            await WalletService.create(walletData)
                              .then((wallet) => {
                                member.wallet = wallet._id
                                member.save()
                                return resolve(member)
                              })
                              .catch((error) => {
                                return reject(new Error(i18n.__('walletCreateError')))
                              })
                          })
                          .catch((error) => {
                            return reject(new Error(i18n.__('memberCreateError')))
                          })
                      })
                      .catch((error) => {
                        return reject(new Error(error.message))
                      })
                  } else if (age < 18) {
                    return reject(new Error(i18n.__('memberCreateAgeLimitError')))
                  } else {
                    return reject(new Error(i18n.__('memberCreateError')))
                  }
                })
              })
            } else {
              return reject(new Error(i18n.__('memberCreateError')))
            }
          }
        })
        .catch((error) => {
          return reject(new Error(i18n.__('memberCreateTcknError')))
        })
    })
  }

  findOne(where) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findOne(where)
        .populate('user')
        .populate('wallet')
        .populate('tenant')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('memberNotFound')))
        })
        .catch((error) => {
          error.message = i18n.__('memberNotFound')
          reject(error)
        })
    })
  }

  // override
  list(where) {
    return new Promise((resolve, reject) => {
      MemberModel.find(where)
        .populate('user')
        .populate('wallet')
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('memberListError')))
        })
        .catch((error) => {
          error.message = i18n.__('memberListError')
          reject(error)
        })
    })
  }

  // override update
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findByIdAndUpdate(id, data, { new: true })
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('memberUpdateError')))
        })
        .catch((error) => {
          error.message = i18n.__('memberUpdateError')
          reject(error)
        })
    })
  }

  // override delete
  delete(id) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findByIdAndDelete(id)
        .then((response) => {
          if (response) resolve(response)
          else reject(new Error(i18n.__('memberDeleteError')))
        })
        .catch((error) => {
          error.message = i18n.__('memberDeleteError')
          reject(error)
        })
    })
  }
}

module.exports = new Members()
