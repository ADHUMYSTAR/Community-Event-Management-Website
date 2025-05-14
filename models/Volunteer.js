const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    schedule: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Volunteer+Opportunity'
    },
    skills: [{
        type: String,
        trim: true
    }],
    contact: {
        type: String,
        required: true,
        trim: true
    },
    volunteers: [{
        name: String,
        email: String,
        phone: String,
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);