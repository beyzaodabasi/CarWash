const Mongoose = require('mongoose')

const WalletSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    user: {
      type: Mongoose.Types.ObjectId,
      ref: 'users',
    },
    transactions: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'transactions',
      },
    ],
    name: String,
    // Member Card
    cards: [
      {
        isActive: {
          type: Boolean,
          default: function () {
            return this.cards?.length > 0 ? true : undefined
          },
        },
        cardUserKey: String,
        cardToken: String,
        cardAlias: String,
        created_date: Date,
      },
    ],
    // Member Temp Card
    tempCard: {
      paymentId: { type: String, default: null },
      conversationId: { type: String, default: null },
      price: { type: Number, default: 0 },
      cardAlias: { type: String, default: null },
      cardHolderName: { type: String, default: null },
      cardNumber: { type: String, default: null },
      expireMonth: { type: String, default: null },
      expireYear: { type: String, default: null },
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
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
)

// Staff Balance
WalletSchema.virtual('balance').get(function () {
  return this.transactions
    .filter(function (transaction) {
      const successed = transaction.status === 'SUCCESSED' && transaction.type === 1
      return successed
    })
    .reduce((total, transaction) => (total += transaction.amount), 0)
})

WalletSchema.set('toObject', { virtuals: true })
WalletSchema.set('toJSON', { virtuals: true })

module.exports = Mongoose.model('wallets', WalletSchema)
