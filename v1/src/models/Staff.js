const Mongoose = require('mongoose')

const StaffSchema = new Mongoose.Schema(
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
    device: {
      type: Mongoose.Types.ObjectId,
      ref: 'devices',
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
    drivingLicenseImage: {
      key: String,
      url: String,
    },
    gsm: {
      type: String,
      required: true,
      unique: true,
    },
    score: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
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

module.exports = Mongoose.model('staffs', StaffSchema)
