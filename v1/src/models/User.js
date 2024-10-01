const Mongoose = require('mongoose')

const UserScheme = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    name: String,
    userName: String,
    gsm: {
      type: String,
      required: true,
    },
    city: String,
    town: String,
    userType: {
      type: String,
      enum: ['TENANT', 'MEMBER', 'STAFF'],
      default: 'STAFF',
    },
    pushToken: {
      type: String,
      nullable: true,
      default: null,
    },
    permissions: {
      createValve: { type: Boolean, default: false },
    },
    active: { type: Boolean, default: true },
    passiveDate: {
      type: Date,
      nullable: true,
    },
    version: String,

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

module.exports = Mongoose.model('users', UserScheme)
