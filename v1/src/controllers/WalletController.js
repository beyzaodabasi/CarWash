const httpStatus = require('http-status')
const Iyzipay = require('iyzipay')
const WalletService = require('../services/Wallets')
const SupportService = require('../services/Supports')
const threedsInitializeCreate = require('../scripts/iyzico/threedsInitializeCreate')
const ApiError = require('../errors/ApiError')
const i18n = require('../config/translate')

const index = async (req, res, next) => {
  if (req.user.userType === 'TENANT') {
    await WalletService.list({ tenant: req.user?.tenant })
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else if (req.user.userType === 'SUPERUSER') {
    await WalletService.list()
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
  } else {
    next(new ApiError(i18n.__('unAuthorized'), httpStatus.UNAUTHORIZED))
  }
}

const show = async (req, res, next) => {
  await WalletService.findOne({ _id: req.params.id })
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
}

const store = async (req, res, next) => {
  req.body.version = req.headers['version']
  await WalletService.create(req.body)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const update = async (req, res, next) => {
  const localTime = new Date(Date.now() + 10800000)
  req.body.updated_date = localTime
  req.body.version = req.headers['version']
  await WalletService.update(req.params.id, req.body)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

const destroy = async (req, res, next) => {
  await WalletService.delete(req.params.id)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => next(new ApiError(error.message, httpStatus.BAD_REQUEST)))
}

// TODO: 3D ile kart kayıt işlemi olacak. Kullanıcıdan belli miktar çekilip, iptal edilecek.
// Eski kart silinmeden array'e eklenip, yeni kart kaydedilecek.
const card3DStart = async (req, res, next) => {
  const localTime = new Date(Date.now() + 10800000)
  const {
    card: { cardAlias: CARD_ALIAS, cardHolderName: CARD_HOLDER_NAME, cardNumber: CARD_NUMBER, expireMonth: EXPIRE_MONTH, expireYear: EXPIRE_YEAR, cvc: CVC },
  } = req.body

  const walletId = req.member.wallet._id
  const member = req.member

  const data = {
    language: req.headers['language'],
    CARD_HOLDER_NAME,
    CARD_ALIAS,
    CARD_NUMBER,
    EXPIRE_MONTH,
    EXPIRE_YEAR,
    CVC,
    member,
  }

  // walletservice findone
  await WalletService.findOne({ _id: walletId })
    .then(async (wallet) => {
      const response = await threedsInitializeCreate(data, res, next)
      return res.status(httpStatus.OK).send(response)
    })
    .catch((error) => next(new ApiError(error.message, httpStatus.NOT_FOUND)))
}

// TODO: 3D nin sonlandırılması
const card3DEnd = async (req, res, next) => {}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  card3DStart,
}
