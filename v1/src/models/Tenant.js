const Mongoose = require('mongoose')

const TenantScheme = new Mongoose.Schema(
  {
    superUser: {
      type: Mongoose.Types.ObjectId,
      ref: 'superUsers',
    },
    user: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    title: String,
    firstName: String,
    lastName: String,
    userName: String,
    email: {
      type: String,
      unique: true,
    },
    taxOffice: String,
    taxNumber: String,
    address: String,
    postalCode: String,
    gsm: String,
    city: String,
    town: String,
    country: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'PASSIVE'],
      default: 'ACTIVE',
    },
    version: [
      {
        type: String,
      },
    ],
    created_date: {
      type: Date,
      default: () => new Date(Date.now() + 10800000),
    },
    updated_date: {
      type: Date,
      default: () => new Date(Date.now() + 10800000),
    },
  },
  { versionKey: false, timestamps: false }
)

module.exports = Mongoose.model('tenants', TenantScheme)
