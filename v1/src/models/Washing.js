const Mongoose = require('mongoose')

const WashingSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    staff: {
      type: Mongoose.Types.ObjectId,
      ref: 'staffs',
    },
    member: {
      type: Mongoose.Types.ObjectId,
      ref: 'members',
    },
    transaction: {
      type: Mongoose.Types.ObjectId,
      ref: 'transactions',
    },
    invoiceInfo: {
      id: String,
      invoiceNumber: String,
    },
    startedUser: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    finishedUser: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    start: Date,
    end: Date,
    total: Number,
    status: {
      type: String,
      enum: ['WAITING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED'],
    },
    cancelledBy: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    startedImage: {
      key: String,
      url: String,
    },
    finishedImage: {
      key: String,
      url: String,
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
  {
    versionKey: false,
    timestamps: false,
  }
)

module.exports = Mongoose.model('washings', WashingSchema)
