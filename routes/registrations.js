const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Get all registrations
router.get('/', async(req, res) => {
    try {
        const registrations = await Registration.find().sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get registration by ID
router.get('/:id', async(req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new registration
router.post('/', async(req, res) => {
    try {
        // First check if the event exists and if it has reached capacity
        const event = await Event.findById(req.body.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check capacity if it's set
        if (event.capacity !== null && event.registeredAttendees.length >= event.capacity) {
            return res.status(400).json({ message: 'Event has reached capacity' });
        }

        // Create new registration
        const newRegistration = new Registration({
            eventId: req.body.eventId,
            attendee: req.body.attendee
        });

        const savedRegistration = await newRegistration.save();

        // Update the event with the new registration
        event.registeredAttendees.push(savedRegistration._id);
        await event.save();

        res.status(201).json(savedRegistration);
    } catch (error) {
        console.error('Error creating registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get registrations by event ID
router.get('/event/:eventId', async(req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.eventId });
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations by event:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete registration
router.delete('/:id', async(req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Remove registration from event
        await Event.findByIdAndUpdate(
            registration.eventId, { $pull: { registeredAttendees: registration._id } }
        );

        // Delete registration
        await Registration.findByIdAndDelete(req.params.id);

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;