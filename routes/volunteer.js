// In your routes file (e.g., routes/volunteer.js)
const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer'); // Your Mongoose model

// Route to handle volunteer registration
router.post('/', async(req, res) => {
    try {
        const { opportunityId, volunteer } = req.body;

        if (!opportunityId || !volunteer) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the volunteer opportunity by ID
        const opportunity = await Volunteer.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }

        // Add new volunteer to the volunteers array
        opportunity.volunteers.push(volunteer);

        // Save the updated opportunity document
        await opportunity.save();

        return res.status(201).json({
            message: 'Volunteer registration successful',
            volunteer: volunteer
        });
    } catch (error) {
        console.error('Error in volunteer registration:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;