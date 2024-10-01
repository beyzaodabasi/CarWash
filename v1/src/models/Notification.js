const Mongoose = require('mongoose')

const NotificationSchema = new Mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    successedCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    notificationType: {
      type: String,
      enum: ['GLOBAL', 'USER'],
      default: 'GLOBAL',
    },
    user: { type: Mongoose.Types.ObjectId, ref: 'users' },
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

module.exports = Mongoose.model('notifications', NotificationSchema)
