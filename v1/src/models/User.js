const Mongoose = require('mongoose')

const UserScheme = new Mongoose.Schema(
  {
    superUser: {
      type: Mongoose.Types.ObjectId,
      ref: 'superusers',
    },
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    name: String,
    gsm: {
      type: String,
      required: true,
      unique: true,
    },
    city: String,
    town: String,
    userType: {
      type: String,
      enum: ['SUPERUSER', 'TENANT', 'MEMBER', 'STAFF'],
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
