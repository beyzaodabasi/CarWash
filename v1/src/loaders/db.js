const Mongoose = require('mongoose')

const db = Mongoose.connection

db.once('open', () => {
  console.log('27017 Portundan Veritabanı Sunucusu Ayağa Kalktı.')
})

const connectDB = async () => {
  await Mongoose.connect(`mongodb://127.0.0.1:27017/carwash`)
  // await Mongoose.connect(`mongodb://127.0.0.1:27017/carwash`, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
}

module.exports = {
  connectDB,
}
