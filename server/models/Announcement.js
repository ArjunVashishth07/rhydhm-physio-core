const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Announcement description is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['regular', 'advisory', 'critical'],
      default: 'regular'
    },
    targetType: {
      type: String,
      enum: ['all', 'individual'],
      default: 'all'
    },
    targetPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Optimize query performance with indexes
announcementSchema.index({ expiryDate: 1 });
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ targetType: 1 });
announcementSchema.index({
  isActive: 1,
  startDate: 1,
  expiryDate: 1,
  targetType: 1,
  targetPatientId: 1
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
