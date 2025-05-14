/*const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async(req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, async(req, res) => {
    try {
        const { title, date, location, description, imageUrl, fee, capacity } = req.body;

        const newEvent = new Event({
            title,
            date,
            location,
            description,
            imageUrl: imageUrl || "/api/placeholder/400/200",
            fee: fee || 0,
            capacity: capacity || null,
            creator: req.user.id
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', auth, async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Already registered for this event' });
        }

        // Check if event is at capacity
        if (event.capacity && event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ msg: 'Event is at capacity' });
        }

        event.registeredUsers.push(req.user.id);
        await event.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Check if user is the event creator
        if (event.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await event.remove();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async(req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get event by ID
router.get('/:id', async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new event
router.post('/', async(req, res) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            date: req.body.date,
            location: req.body.location,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            capacity: req.body.capacity,
            fee: req.body.fee,
            registeredAttendees: []
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update event
router.put('/:id', async(req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete event
router.delete('/:id', async(req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;