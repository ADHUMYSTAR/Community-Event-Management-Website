const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Get user activity data
router.get('/users/:userId/activity', auth, async(req, res) => {
    try {
        const userId = req.params.userId;

        // Verify the requesting user is accessing their own data
        if (req.user.id !== userId) {
            return res.status(403).json({ msg: 'Not authorized to access this data' });
        }

        // Find all events created by this user
        const createdEvents = await Event.find({ organizer: userId });

        // Find all event registrations by this user
        const registrations = await Registration.find({ user: userId })
            .populate('event', 'title date location');

        // Find upcoming registrations (events that haven't happened yet)
        const now = new Date();
        const upcomingRegistrations = registrations.filter(reg =>
            reg.event && new Date(reg.event.date) > now
        );

        // Find past registrations (events that have already occurred)
        const pastRegistrations = registrations.filter(reg =>
            reg.event && new Date(reg.event.date) <= now
        );

        // Calculate community impact score
        // This could be based on number of events created, participations, etc.
        const communityImpact = (createdEvents.length * 50) + (pastRegistrations.length * 25);

        // Get recent activity (last 10 items, sorted by most recent)
        const recentActivity = [];

        // Add created events to activity
        createdEvents.forEach(event => {
            recentActivity.push({
                type: 'event_created',
                description: `Created event: ${event.title}`,
                timestamp: event.createdAt
            });
        });

        // Add registrations to activity
        registrations.forEach(reg => {
            if (reg.event) {
                recentActivity.push({
                    type: 'event_registered',
                    description: `Registered for: ${reg.event.title}`,
                    timestamp: reg.createdAt
                });
            }
        });

        // Sort by most recent first and limit to 10 items
        const sortedActivity = recentActivity.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        ).slice(0, 10);

        // Get cart data if available
        // This would come from your cart model or service
        const cart = {
            itemCount: 0,
            totalPrice: 0
        };

        // Respond with the activity data
        res.json({
            eventsCreated: createdEvents.length,
            eventsParticipated: pastRegistrations.length,
            upcomingEvents: upcomingRegistrations.length,
            communityImpact,
            recentActivity: sortedActivity,
            cart
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;