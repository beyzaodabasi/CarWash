const Mongoose = require('mongoose')

const SuperUserSchema = new Mongoose.Schema(
  {
    user: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    gsm: {
      type: String,
      required: true,
      unique: true,
    },
    address: String,
    city: String,
    town: String,
    version: String,
    createdDate: {
      type: Date,
      default: () => new Date(Date.now() + 10800000),
    },
    updatedDate: {
      type: Date,
      default: () => new Date(Date.now() + 10800000),
    },
  },
  { versionKey: false, timestamps: false }
)

module.exports = Mongoose.model('superUsers', SuperUserSchema)
