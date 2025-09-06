const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  clubhead: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  maxMembers: { type: Number, default: 50 },
  requirements: [String],
  recruitmentStatus: { 
    type: String, 
    enum: ['open', 'closed'], 
    default: 'open' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Club', ClubSchema);