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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gsm: {
      type: String,
      required: true,
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
