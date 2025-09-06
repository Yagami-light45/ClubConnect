const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    clubhead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maxMembers: {
        type: Number,
        default: 50
    },
    currentMembers: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    recruitmentStatus: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    requirements: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Club', clubSchema);