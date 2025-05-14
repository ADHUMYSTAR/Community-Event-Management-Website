const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Profile update route
router.post('/update', async(req, res) => {
    const { email, phoneNumber, address } = req.body;

    try {
        // Find user by email and update
        const user = await User.findOneAndUpdate({ email }, {
            phoneNumber,
            address
        }, {
            new: true, // Return the updated document
            runValidators: true // Run model validation
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Respond with updated user details
        res.json({
            msg: 'Profile updated successfully',
            user: {
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address
            }
        });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ msg: 'Server error updating profile' });
    }
});

module.exports = router;