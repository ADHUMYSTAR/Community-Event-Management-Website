const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    attendee: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Registration', RegistrationSchema);