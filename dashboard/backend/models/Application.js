const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    recruitmentDrive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RecruitmentDrive'
    },
    answers: {
        type: Map,
        of: String
    },
    additionalInfo: String,
    status: {
        type: String,
        enum: ['pending', 'under_review', 'accepted', 'rejected'],
        default: 'pending'
    },
    feedback: String,
    reviewedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);