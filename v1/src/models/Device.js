const Mongoose = require('mongoose')

const DeviceSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Types.ObjectId,
      ref: 'tenants',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PASSIVE'],
      default: 'ACTIVE',
    },
    plate: String,
    brand: String,
    model: String,
    // Araç görseli
    image: {
      key: String,
      url: String,
    },
    // Ruhsat görseli
    licenseImage: {
      key: String,
      url: String,
    },
    // araç tipi -> elektrikli, hibrit, benzinli, dizel
    type: {
      type: String,
      enum: ['ELECTRIC', 'HYBRID', 'PETROL', 'DIESEL'],
    },
    city: String,
    town: String,
    country: String,
    hardware: {
      ornek: { type: Boolean, default: false },
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

module.exports = Mongoose.model('devices', DeviceSchema)