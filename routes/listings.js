const express = require('express');
const Listing = require('../models/Listing');

const router = express.Router();

// ✅ Get all listings
router.get('/', async(req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// ✅ Search listings by title
router.get('/search', async(req, res) => {
    try {
        const { term } = req.query;
        const listings = await Listing.find({ title: new RegExp(term, 'i') });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search listings' });
    }
});

// ✅ Filter listings by type
router.get('/type/:type', async(req, res) => {
    try {
        const listings = await Listing.find({ type: req.params.type });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to filter listings by type' });
    }
});

// ✅ Filter listings by category
router.get('/category/:category', async(req, res) => {
    try {
        const listings = await Listing.find({ category: req.params.category });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to filter listings by category' });
    }
});

// ✅ Get listing by ID
router.get('/:id', async(req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ error: 'Listing not found' });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

// ✅ Add new listing
router.post('/', async(req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.json(newListing);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add listing' });
    }
});

// Open listing details modal
async function openListingDetails(listingId) {
    try {
        console.log(`Fetching details for listing ID: ${listingId}`);
        const response = await fetch(`${API_URL}/${listingId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch listing details');
        }

        const listing = await response.json();
        console.log('Fetched listing details:', listing);

        const modal = document.getElementById('listingDetailsModal');

        document.getElementById('detailModalTitle').textContent = listing.title;
        document.getElementById('detailModalDescription').textContent = listing.description;
        document.getElementById('detailModalPrice').innerHTML = `<strong>Price:</strong> $${listing.price.toFixed(2)}`;
        document.getElementById('detailModalLocation').innerHTML = `<strong>Location:</strong> ${listing.location}`;
        document.getElementById('detailModalSeller').innerHTML = `<strong>Seller:</strong> ${listing.seller}`;
        document.getElementById('detailModalCategory').innerHTML = `<strong>Category:</strong> ${listing.category}`;

        // Format date for display
        const postedDate = new Date(listing.datePosted).toLocaleDateString();
        document.getElementById('detailModalDate').innerHTML = `<strong>Posted:</strong> ${postedDate}`;

        // Hide contact info initially
        document.getElementById('sellerContactInfo').style.display = 'none';

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading listing details:', error);
        alert('Failed to load listing details. Please try again.');
    }
}

module.exports = router;