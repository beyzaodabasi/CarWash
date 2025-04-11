const httpStatus = require('http-status')
const fs = require('fs')
const mime = require('mime')

const uploadImage = async (file, res) => {
  const base64Data = file.base64Data
  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
  const response = {}
  const date = new Date()
  const path = `uploads/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`
  fs.mkdirSync(path, { recursive: true })
  if (matches?.length !== 3) {
    return new Error('Invalid input string')
  }
  response.type = matches[1]
  response.data = Buffer.from(matches[2], 'base64')
  let decodedImg = response
  let imageBuffer = decodedImg.data
  let type = decodedImg.type
  console.log('type', type)
  let extension = mime.getExtension(type)
  let randomName = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters?.length
  for (let i = 0; i < 32; i++) {
    randomName += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  let fileName = randomName + '.' + extension
  try {
    fs.writeFileSync(path + fileName, imageBuffer, 'utf8')
    console.log('Image has been saved', path + fileName)
    // return res.status(httpStatus.OK).send({ status: 'success', path: path + fileName })
    return { key: fileName, path: `${path}${fileName}` }
  } catch (err) {
    console.log(err)
    // return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: 'error', message: err.message })
    throw new Error('Image saving failed')
  }
}

module.exports = uploadImage
