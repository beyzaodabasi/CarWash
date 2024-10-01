const CryptoJS = require('crypto-js')
const JWT = require('jsonwebtoken')

const createPasswordToHash = (password) => {
  return CryptoJS.HmacSHA256(password, CryptoJS.HmacSHA1(process.env.APP_PASSWORD_HASH, password).toString()).toString()
}

const generateAccessToken = (user) => {
  return JWT.sign(user, process.env.APP_ACCESS_TOKEN_HASH, {
    expiresIn: '90 days',
  })
}

const generateRefreshToken = (user) => {
  return JWT.sign(user, process.env.APP_REFRESH_TOKEN_HASH, {
    expiresIn: '100 days',
  })
}

const reGenerateAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.APP_REFRESH_TOKEN_HASH, (err, user) => {
      if (err) reject(err)
      resolve(JWT.sign(user, process.env.APP_ACCESS_TOKEN_HASH))
    })
  })
}

const verifyAccessToken = (accessToken, refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(accessToken, process.env.APP_ACCESS_TOKEN_HASH, (err, user) => {
      if (err) {
        // console.log('AccessToken verify edilemedi...', err.message)
        JWT.verify(refreshToken, process.env.APP_REFRESH_TOKEN_HASH, (err, user) => {
          // console.log('RefreshToken verify işlemi çalıştı...')
          if (err) reject(err)
          let data = {
            accessToken: JWT.sign(user, process.env.APP_ACCESS_TOKEN_HASH, {
              expiresIn: '90 days',
            }),
          }

          // console.log('RefreshToken verify işlemi çalıştı...')
          resolve(data)
        })
      }
      resolve({ accessToken: accessToken })
    })
  })
}

module.exports = {
  createPasswordToHash,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
}
