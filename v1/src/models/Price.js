const Mongoose = require('mongoose')

const PriceSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    // Hangi faktör: 'CITY' | 'SIZE' | 'WASHTYPE'
    factorType: {
      type: String,
      enum: ['CITY', 'SIZE', 'WASHTYPE'],
      required: true,
    },
    // Örneğin CITY için 'SIVAS', SIZE için 'SMALL' | 'LARGE', WASHTYPE için 'INTERIOR' | 'EXTERIOR' | 'BOTH'
    factorKey: {
      type: String,
      required: true,
    },
    // Bu faktörün fiyat katkısı (TL)
    value: {
      type: Number,
      required: true,
    },
    priceRate: {
      type: Number,
      default: 1,
    },
    version: String,
    created_date: { type: Date, default: () => new Date(Date.now() + 10800000) },
    updated_date: { type: Date, default: () => new Date(Date.now() + 10800000) },
  },
  { versionKey: false, timestamps: false }
)

PriceSchema.index({ tenant: 1, factorType: 1, factorKey: 1 }, { unique: true })

module.exports = Mongoose.model('prices', PriceSchema)
