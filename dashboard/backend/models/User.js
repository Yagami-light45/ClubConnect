const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'clubhead', 'admin'],
        required: true
    },
    phone: String,
    year: Number,
    branch: String,
    skills: String,
    interests: String,
    bio: String,
    department: String,
    position: String,
    experience: String,
    specializations: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);