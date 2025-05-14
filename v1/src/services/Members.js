const BaseService = require('./BaseService')
const MemberModel = require('../models/Member')
const UserService = require('./Users')
const WalletService = require('./Wallets')
const moment = require('moment')
const soap = require('soap')
const axios = require('axios')
const xml2js = require('xml2js')
const auth = require('../scripts/utils/auth')
const i18n = require('../config/translate')

class Members extends BaseService {
  constructor() {
    super(MemberModel)
  }

  create(data) {
    return new Promise((resolve, reject) => {
      // 1) GSM başında 0 olamaz
      if (data.gsm[0] === '0') {
        return reject(new Error(i18n.__('memberGsm0Error')))
      }

      // 2) Aynı TCKN veya aynı GSM ile üye var mı?
      MemberModel.findOne({
        $or: [{ tckn: data.tckn }, { gsm: data.gsm }],
      })
        .then((found) => {
          if (found) {
            // hangisi çakıştıysa o alana özel hata
            if (found.tckn === data.tckn) {
              throw new Error('memberCreateTcknError')
            }
            if (found.gsm === data.gsm) {
              throw new Error('memberCreateGsmError')
            }
          }
          return data
        })
        // 3) Türk vatandaşıysa TCKN doğrula; yabancıysa atla
        .then((data) => {
          if (data.otherNationality === false) {
            const address = 'https://tckimlik.nvi.gov.tr/service/kpspublic.asmx?WSDL'
            return new Promise((res, rej) => {
              soap.createClient(address, (err, client) => {
                if (err) return rej(err)
                const year = moment(data.birthDate).format('YYYY')
                client.TCKimlikNoDogrula(
                  {
                    TCKimlikNo: data.tckn,
                    Ad: data.firstName,
                    Soyad: data.lastName,
                    DogumYili: year,
                  },
                  (err, result) => {
                    if (err) return rej(err)
                    if (!result.TCKimlikNoDogrulaResult) {
                      return rej(new Error('memberIdentityVerificationError'))
                    }
                    res(data)
                  }
                )
              })
            })
          }
          return data
        })
        // 4) Ortak: user → member → wallet
        .then(async (data) => {
          const userData = {
            tenant: data.tenant,
            email: data.email,
            password: data.password,
            name: `${data.firstName} ${data.lastName}`,
            gsm: data.gsm,
            city: data.city,
            town: data.town,
            userType: 'MEMBER',
            active: true,
            version: data.version,
          }

          return UserService.create(userData)
            .then(async (user) => {
              data.user = user._id
              return MemberModel.create(data).then((member) => ({ user, member }))
            })
            .then(async ({ user, member }) => {
              const walletData = {
                tenant: data.tenant,
                user: user._1d,
                name: `${data.firstName} ${data.lastName}`,
                balance: 0,
                version: data.version,
              }
              return WalletService.create(walletData).then((wallet) => {
                member.wallet = wallet._id
                return member.save()
              })
            })
        })
        // 5) Sonuç veya hata
        .then((member) => resolve(member))
        .catch((err) => {
          // hata koduna göre mesajı i18n ile değiştir
          if (err.message === 'memberCreateTcknError') {
            err.message = i18n.__('memberCreateTcknError')
          } else if (err.message === 'memberCreateGsmError') {
            err.message = i18n.__('memberCreateGsmError')
          } else if (err.message === 'memberIdentityVerificationError') {
            err.message = i18n.__('memberIdentityVerificationError')
          } else if (err.message === 'walletCreateError') {
            err.message = i18n.__('walletCreateError')
          } else {
            err.message = i18n.__('memberCreateError')
          }
          reject(err)
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

  async smsLogin(data) {
    return new Promise(async (resolve, reject) => {
      await MemberModel.findOne({ gsm: data.gsm, tenant: data.tenant })
        .then(async (member) => {
          let code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
          if (data.gsm == '5424142758') {
            code = '123456'
            return resolve({ code: code, member: member })
          }

          let smsUserCode = ''
          let smsPassword = ''
          let smsBody = `<?xml version="1.0"?>
                  <mainbody>
                    <header>
                        <usercode>${smsUserCode}</usercode>
                        <password>${smsPassword}</password>
                        <msgheader>AHTAPOT</msgheader>
                    </header>
                    <body>
                        <msg>
                            <![CDATA[${i18n.__('smsSendMessage', { code: code })}]]>
                        </msg>
                        <no>${data.gsm}</no>
                    </body>
                  </mainbody>`
          if (member && member.uid && member.uid == data.uid) {
            return resolve({ code: null, member: member })
          } else {
            return resolve({ code: code, member: member })
            // TODO: SMS gönderimi için netgsm API kullanılacak
            // await axios
            //   .post('https://api.netgsm.com.tr/sms/send/otp', smsBody)
            //   .then((result) => {
            //     let parser = new xml2js.Parser()
            //     parser.parseString(result.data, function (err, result) {
            //       if (result.xml.main[0].code[0] == '0') {
            //         resolve({ code: code, member: member })
            //       } else {
            //         reject({
            //           message: i18n.__('smsSendError'),
            //         })
            //       }
            //     })
            //   })
            //   .catch((error) => {
            //     error.message = i18n.__('smsSendError')
            //     reject(error)
            //   })
          }
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
