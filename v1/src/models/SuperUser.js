const Mongoose = require('mongoose')

const SuperUserSchema = new Mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    gsm: String,
    address: String,
    city: String,
    town: String,
    users: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
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
