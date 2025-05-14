const Mongoose = require('mongoose')

const SupportSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    user: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    category: {
      type: String,
      enum: ['DIGER', 'SYSTEM', '3DSECURE'],
    },
    description: String,
    plate: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'DONE', 'CONTROLLED'],
      default: 'ACTIVE',
    },
    finishedStaff: {
      type: Mongoose.Types.ObjectId,
      ref: 'staffs',
    },
    note: String,
    version: String,
    created_date: { type: Date, default: () => new Date(Date.now() + 10800000) },
    updated_date: { type: Date, default: () => new Date(Date.now() + 10800000) },
  },
  { versionKey: false, timestamps: false }
)

module.exports = Mongoose.model('supports', SupportSchema)
