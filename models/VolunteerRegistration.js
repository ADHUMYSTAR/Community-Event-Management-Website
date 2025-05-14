const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for volunteer registration
const VolunteerRegistrationSchema = new Schema({
    opportunityId: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    volunteer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            default: ''
        },
        availability: {
            type: String,
            enum: ['full', 'partial', 'flexible'],
            required: true
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Add indexes for faster querying
VolunteerRegistrationSchema.index({ 'volunteer.email': 1, opportunityId: 1 }, { unique: true });
VolunteerRegistrationSchema.index({ opportunityId: 1 });
VolunteerRegistrationSchema.index({ 'volunteer.name': 1 });
VolunteerRegistrationSchema.index({ status: 1 });

module.exports = mongoose.model('VolunteerRegistration', VolunteerRegistrationSchema);