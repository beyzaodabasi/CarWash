const httpStatus = require('http-status')
const Iyzipay = require('iyzipay')
const ApiError = require('../../errors/ApiError')
const WalletService = require('../../services/Wallets')

const threedsInitializeCreate = async (data, res, next) => {
  console.log('threedsInitializeCreate', data)
  const price = 10
  const iyzico = new Iyzipay({
    apiKey: process.env.IYZICOSANDBOXAPIKEY,
    secretKey: process.env.IYZICOSANDBOXSECRETKEY,
    uri: process.env.IYZICOSANDBOXBASEURL,
    // apiKey: process.env.IYZICOAPIKEY,
    // secretKey: process.env.IYZICOSECRETKEY,
    // uri: process.env.IYZICOBASEURL,
  })
  const callBackUrl = process.env.CALLBACKURL
  const localTime = new Date(Date.now() + 10800000)

  const iyzico3DPaymentData = {
    locale: data.language.toLowerCase().substring(0, 2) == 'tr' ? Iyzipay.LOCALE.TR : Iyzipay.LOCALE.EN,
    conversationId: Date.now(),
    price: price,
    paidPrice: price,
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: Date.now(),
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: callBackUrl,
    paymentCard: {
      cardHolderName: data.CARD_HOLDER_NAME,
      cardNumber: data.CARD_NUMBER,
      expireMonth: data.EXPIRE_MONTH,
      expireYear: data.EXPIRE_YEAR,
      cvc: data.CVC,
      registerCard: '0',
    },
    buyer: {
      id: data.member._id,
      name: data.member.firstName,
      surname: data.member.lastName,
      gsmNumber: data.member.gsm,
      email: data.member.user.email,
      identityNumber: data.member.tckn,
      registrationAddress: data.member.addresses.length > 0 ? data.member.addresses[0].address : 'adres',
      ip: '',
      city: data.member.addresses.length > 0 ? data.member.addresses[0].city : 'city',
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: data.member.firstName + ' ' + data.member.lastName,
      city: data.member.addresses.length > 0 ? data.member.addresses[0].city : 'city',
      country: 'Turkey',
      address: data.member.addresses.length > 0 ? data.member.addresses[0].address : 'adres',
    },
    billingAddress: {
      contactName: data.member.firstName + ' ' + data.member.lastName,
      city: data.member.addresses.length > 0 ? data.member.addresses[0].city : 'city',
      country: 'Turkey',
      address: data.member.addresses.length > 0 ? data.member.addresses[0].address : 'adres',
    },
    basketItems: [
      {
        id: '1',
        name: 'Ahtapot Kart Kontrol Bedeli',
        category1: 'Card Check',
        category2: 'Ahtapot',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: price,
      },
    ],
  }

  // iyzico.threedsInitialize.create(iyzico3DPaymentData, async function (err, result) {
  //   if (result.status == 'success' && result.conversationId && result.threeDSHtmlContent && result.threeDSHtmlContent.length > 0) {
  //     // Kart bilgilerini ve price bilgilerini geçici olarak wallet içinde tempCard objesinde tut.
  //     const tempCard = {
  //       conversationId: result.conversationId,
  //       price: price,
  //       cardAlias: data.CARD_ALIAS,
  //       cardHolderName: data.CARD_HOLDER_NAME,
  //       cardNumber: data.CARD_NUMBER,
  //       expireMonth: data.EXPIRE_MONTH,
  //       expireYear: data.EXPIRE_YEAR,
  //     }
  //     await WalletService.update(data.member.wallet._id, { tempCard: tempCard })
  //       .then(() => {
  //         // 3D Payment Form is created, return it to client side.
  //         const convertedHTML = Buffer.from(result.threeDSHtmlContent, 'base64').toString('utf8')
  //         // send 3D Payment Form to client side. (HTML)
  //         return res.status(httpStatus.OK).send({ html: convertedHTML })
  //       })
  //       .catch((err) => {
  //         // TODO: Support model oluşturup, error log tut.
  //         console.log('Error while updating wallet tempCard', err)
  //         const supportData = {
  //           tenant: data.member.tenant._id,
  //           user: data.member.user._id,
  //           category: '3DSECURE',
  //           description: `(Geçici Kart Kayıt Hatası) 3D Secure işlemi sırasında geçici kart bilgileri kaydedilemedi. Ödeme alınmadı. Form gönderilemedi. Hata: ${err.message}`,
  //           status: 'ACTIVE',
  //           version: '3DSECURE',
  //           created_date: localTime,
  //           updated_date: localTime,
  //         }
  //         SupportService.create(supportData)
  //         return next(new ApiError(i18n.__('3DTempCardStoreError'), httpStatus.BAD_REQUEST))
  //       })
  //   }
  //   if (result.status != 'success') {
  //     // TODO: Support model oluşturup, error log tut.
  //     console.log('Error while creating 3D Payment Form', result.errorMessage)
  //     const supportData = {
  //       tenant: data.member.tenant._id,
  //       user: data.member.user._id,
  //       category: '3DSECURE',
  //       description: `(3D Form Hatası) 3D Secure işlem başlatma sırasında 3D Payment Form oluşturulamadı. Ödeme alınmadı. Form gönderilemedi. Hata: ${
  //         result.errorMessage
  //       } Kart: **** **** **** ${data.CARD_NUMBER.slice(-4)}`,
  //       status: 'ACTIVE',
  //       version: '3DSECURE',
  //       created_date: localTime,
  //       updated_date: localTime,
  //     }
  //     SupportService.create(supportData)
  //     return next(new ApiError(i18n.__('3DInitializeError'), httpStatus.BAD_REQUEST))
  //   }
  //   if (err) {
  //     // TODO: Support model oluşturup, error log tut.
  //     const supportData = {
  //       tenant: data.member.tenant._id,
  //       user: data.member.user._id,
  //       category: '3DSECURE',
  //       description: `(3D Form Hatası) 3D Secure işlem başlatma sırasında 3D Payment Form oluşturulamadı. Ödeme alınmadı. Form gönderilemedi. Hata: ${
  //         result.errorMessage
  //       } Kart: **** **** **** ${data.CARD_NUMBER.slice(-4)}`,
  //       status: 'ACTIVE',
  //       version: '3DSECURE',
  //       created_date: localTime,
  //       updated_date: localTime,
  //     }
  //     SupportService.create(supportData)
  //     return next(new ApiError(i18n.__('3DInitializeError'), httpStatus.BAD_REQUEST))
  //   }
  // })
  return { html: 'test' }
}

module.exports = threedsInitializeCreate
