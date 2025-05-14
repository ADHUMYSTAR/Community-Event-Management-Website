const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
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
        default: 'https://via.placeholder.com/300x200?text=Community+Event'
    },
    capacity: {
        type: Number,
        default: null
    },
    fee: {
        type: Number,
        default: 0
    },
    registeredAttendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);