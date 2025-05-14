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
    // TODO: randevu adresi
    // member içerisinde birden fazla adresi var ordan seçtiği adres eklenecek
    // randevu saati
    start: Date,
    // yıkama bitiş saati
    end: Date,
    total: Number,
    factors: [
      {
        type: Mongoose.Types.ObjectId,
        ref: 'prices',
      },
    ],
    status: {
      type: String,
      enum: ['WAITING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED'],
      default: 'WAITING',
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
