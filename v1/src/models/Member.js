const Mongoose = require('mongoose')

const MemberSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    user: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    wallet: {
      type: Mongoose.Types.ObjectId,
      ref: 'wallets',
    },
    firstName: String,
    lastName: String,
    birthDate: { type: Date, required: true },
    otherNationality: {
      type: Boolean,
      required: true,
    },
    tckn: {
      type: String,
      required: true,
      unique: true,
    },
    vkn: String,
    gsm: {
      type: String,
      required: true,
      unique: true,
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

module.exports = Mongoose.model('members', MemberSchema)
