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
    devices: [
      {
        type: Mongoose.Types.ObjectId,
        ref: 'devices',
      },
    ],
    addresses: [
      {
        isActive: {
          type: Boolean,
          default: function () {
            return this.addresses?.length > 0 ? true : undefined
          },
        },
        address: String,
        city: String,
        town: String,
      },
    ],
    firstName: String,
    lastName: String,
    birthDate: { type: Date, required: true },
    otherNationality: {
      type: Boolean,
      required: true,
    },
    nation: {
      type: String,
      required: true,
      maxlength: 2,
    },
    gender: {
      type: String,
      required: true,
      enum: ['E', 'K'],
    },
    uid: {
      type: String,
      nullable: true,
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
