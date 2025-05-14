const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'Item' or 'Service'
    category: { type: String, required: true },
    seller: { type: String, required: true },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);