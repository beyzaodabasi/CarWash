const httpStatus = require('http-status')
const Iyzipay = require('iyzipay')
const ApiError = require('../../errors/ApiError')
const WalletService = require('../../services/Wallets')
const SupportService = require('../../services/Supports')
const i18n = require('../../config/translate')

// TODO: Çok eksik sonra bakılacak!!!!

const threedsPaymentCreate = async (data, res, next) => {
  console.log('threedsInitializeCreate', data)
  // mdStatus = 0   3-D Secure imzası geçersiz veya doğrulama
  // mdStatus = 2   Kart sahibi veya bankası sisteme kayıtlı değil
  // mdStatus = 3   Kartın bankası sisteme kayıtlı değil
  // mdStatus = 4   Doğrulama denemesi, kart sahibi sisteme daha sonra kayıt olmayı seçmiş
  // mdStatus = 5   Doğrulama yapılamıyor
  // mdStatus = 6   3-D Secure hatası
  // mdStatus = 7   Sistem hatası
  // mdStatus = 8   Bilinmeyen kart no
  // mdStatus = 9   Ödeme alındı fakat kart kayıt edilemedi
  // mdStatus = 10  Ödeme alındı ve kart kayıt edildi fakat işlem şüpheli
  // mdStatus = 11  Kullanıcı bilgileri bulunamadı

  const callBackUrl = process.env.CALLBACKURL
  const localTime = new Date(Date.now() + 10800000)

  const isSuccessful = data?.mdStatus

  if (isSuccessful == '1') {
    const iyzico = new Iyzipay({
      apiKey: process.env.IYZICOSANDBOXAPIKEY,
      secretKey: process.env.IYZICOSANDBOXSECRETKEY,
      uri: process.env.IYZICOSANDBOXBASEURL,
      // apiKey: process.env.IYZICOAPIKEY,
      // secretKey: process.env.IYZICOSECRETKEY,
      // uri: process.env.IYZICOBASEURL,
    })
    const iyzico3DPaymentEndData = {
      conversationId: data?.conversationId,
      locale: Iyzipay.LOCALE.TR,
      paymentId: data?.paymentId,
      conversationData: data?.conversationData,
    }
    iyzico.threedsPayment.create(iyzico3DPaymentEndData, async function (err, result) {
      if (result.status == 'success') {
        // işlem başarılı ise iptal edilmeli
        // TODO: Devam edilecek değişebilir.
        //TODO: Iyzico card create işlemi yapılacak
        await WalletService.findOne({ 'tempCard.conversationId': data?.conversationId })
          .then(async (wallet) => {
            let tempCard = wallet?.tempCard

            const iyzicoCardStoreData = {
              locale: Iyzipay.LOCALE.TR,
              conversationId: data?.conversationId,
              email: wallet?.member?.user?.email, // TODO: kontrol edilecek
              externalId: Date.now(),
              card: {
                cardAlias: tempCard?.cardAlias,
                cardHolderName: tempCard?.cardHolderName,
                cardNumber: tempCard?.cardNumber,
                expireMonth: tempCard?.expireMonth,
                expireYear: tempCard?.expireYear,
              },
            }

            iyzico.card.create(iyzicoCardStoreData, async (err, result) => {
              await WalletService.update(wallet?._id, {
                $set: {
                  tempCard: null,
                },
              })
              if (err) {
                // TODO: data içerisindeki veriler doğru mu kontrol edilecek
                const supportData = {
                  tenant: wallet?.tenant?._id,
                  user: wallet?.user?._id,
                  category: '3DSECURE',
                  description: `(IYZICO Kart Kayıt Hatası) 3D Secure işlem tamamlama sırasında karttan para çekildi. Fakat IYZICO tarafta kart kayıt edilemedi. Hata: ${JSON.stringify(
                    err
                  )} Kart: **** **** **** ${tempCard.cardNumber.slice(-4)}`,
                  status: 'ACTIVE',
                  version: '3DSECURE',
                  created_date: localTime,
                  updated_date: localTime,
                }
                SupportService.create(supportData)
                return next(new ApiError(i18n.__('3DTempCardStoreError'), httpStatus.BAD_REQUEST))
              }
              if (result.status == 'success') {
                // kart bilgileri diğer kart bilgilerini silmeden array'e eklenmeli
                const cardData = {
                  isActive: true,
                  cardUserKey: result?.cardUserKey,
                  cardToken: result?.cardToken,
                  cardAlias: tempCard?.cardAlias,
                  created_date: localTime,
                }
                await WalletService.update(wallet?._id, {
                  $push: {
                    cards: cardData,
                  },
                })
                  .then(() => {
                    return res.redirect(`${callBackUrl}/md1`)
                  })
                  .catch((err) => {
                    const supportData = {
                      tenant: wallet?.tenant?._id,
                      user: wallet?.user?._id,
                      category: '3DSECURE',
                      description: `(IYZICO Kart Kayıt Hatası) 3D Secure işlem tamamlama sırasında karttan para çekildi. Fakat Wallet içerisine kart kayıt edilemedi. Hata: ${JSON.stringify(
                        err
                      )} Kart: **** **** **** ${tempCard.cardNumber.slice(-4)}`,
                      status: 'ACTIVE',
                      version: '3DSECURE',
                      created_date: localTime,
                      updated_date: localTime,
                    }
                    SupportService.create(supportData)
                    return next(new ApiError(i18n.__('3DTempCardStoreError'), httpStatus.BAD_REQUEST))
                  })
              }
            })
          })
          .catch((error) => {
            error.message = i18n.__('memberNotFound')
            return next(new ApiError(error.message, httpStatus.NOT_FOUND))
          })
        // iyzico.cancel.create(
        //   {
        //     locale: Iyzipay.LOCALE.TR,
        //     conversationId: data?.conversationId,
        //     paymentId: result.paymentId.toString(),
        //     ip: '',
        //   },
        //   (err, result) => {
        //     if (result.status == 'success') {
        //       return res.status(httpStatus.OK).send(i18n.__('iyzicoPaymentSuccess'))
        //     }
        //   }
        // )
      } else {
        return res.redirect(`${callBackUrl}/md7`)
      }
    })
  } else {
    // 3D işlemi başarılı değil, support oluştur hata mesajı gönder
    return res.redirect(`${callBackUrl}/md-1`)
  }
}

module.exports = threedsPaymentCreate
