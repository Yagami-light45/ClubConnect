// backend/models/RecruitmentDrive.js
const mongoose = require('mongoose');

const recruitmentDriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  clubHeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  maxApplications: {
    type: Number,
    default: 50,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
recruitmentDriveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
recruitmentDriveSchema.index({ clubId: 1 });
recruitmentDriveSchema.index({ isActive: 1 });
recruitmentDriveSchema.index({ deadline: 1 });

module.exports = mongoose.model('RecruitmentDrive', recruitmentDriveSchema);