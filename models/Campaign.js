// models/Campaign.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CampaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    goal: {
        type: Number,
        required: true,
        min: 100
    },
    raised: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    donations: [DonationSchema]
});

module.exports = mongoose.model('Campaign', CampaignSchema);