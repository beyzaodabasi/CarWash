const Mongoose = require('mongoose')

const TransactionSchema = new Mongoose.Schema(
  {
    // Üç tip transaction type'ı olabilir.
    // type -1 olma durumu member'ın ödeme yaptığı durum
    // type 0 olma durumu yatırılan tutarın askıda olma durumu
    // type 1 olma durumu yatırılan tutarın staff'a aktarıldığı durum
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    wallet: {
      type: Mongoose.Types.ObjectId,
      ref: 'wallets',
    },
    washing: {
      type: Mongoose.Types.ObjectId,
      ref: 'washings',
    },
    amount: Number,
    paymentGateway: String,
    transactionId: String,
    type: {
      type: Number,
      enum: [-1, 0, 1],
      default: 0,
    },
    status: {
      type: String,
      enum: ['SUCCESSED', 'FAILED'],
    },
    version: String,
    ip: { type: String, default: 'oldVersion' },
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

module.exports = Mongoose.model('transactions', TransactionSchema)
