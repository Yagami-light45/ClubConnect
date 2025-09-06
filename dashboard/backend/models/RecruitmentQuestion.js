// backend/models/RecruitmentQuestion.js
const mongoose = require('mongoose');

const recruitmentQuestionSchema = new mongoose.Schema({
  recruitmentDriveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecruitmentDrive',
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['text', 'textarea', 'select', 'multiselect', 'radio', 'checkbox', 'number', 'email', 'date']
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  options: [{
    type: String,
    trim: true
  }],
  orderIndex: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
recruitmentQuestionSchema.index({ recruitmentDriveId: 1 });
recruitmentQuestionSchema.index({ recruitmentDriveId: 1, orderIndex: 1 });

module.exports = mongoose.model('RecruitmentQuestion', recruitmentQuestionSchema);