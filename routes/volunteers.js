const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// Get all volunteer opportunities
router.get('/', async(req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ createdAt: -1 });
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get volunteer opportunity by ID
router.get('/:id', async(req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }
        res.json(volunteer);
    } catch (error) {
        console.error('Error fetching volunteer opportunity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new volunteer opportunity
router.post('/', async(req, res) => {
    try {
        const newVolunteer = new Volunteer({
            title: req.body.title,
            schedule: req.body.schedule,
            location: req.body.location,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            skills: req.body.skills,
            contact: req.body.contact,
            volunteers: []
        });

        const savedVolunteer = await newVolunteer.save();
        res.status(201).json(savedVolunteer);
    } catch (error) {
        console.error('Error creating volunteer opportunity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update volunteer opportunity
router.put('/:id', async(req, res) => {
    try {
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        if (!updatedVolunteer) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }

        res.json(updatedVolunteer);
    } catch (error) {
        console.error('Error updating volunteer opportunity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete volunteer opportunity
router.delete('/:id', async(req, res) => {
    try {
        const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);

        if (!deletedVolunteer) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }

        res.json({ message: 'Volunteer opportunity deleted successfully' });
    } catch (error) {
        console.error('Error deleting volunteer opportunity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add volunteer to opportunity
router.post('/:id/register', async(req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }

        volunteer.volunteers.push({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        });

        const updatedVolunteer = await volunteer.save();
        res.json(updatedVolunteer);
    } catch (error) {
        console.error('Error registering volunteer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;