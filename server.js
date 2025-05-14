const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/volunteer', require('./routes/volunteer'));
app.use('/api/listings', require('./routes/listings'));

// Serve static assets in production
app.use(express.static('public'));

// Serve HTML file for donation page
app.get('/donate', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'donate.html'));
});

app.get('/donate', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'events.html'));
});

// Serve all other routes to index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'home.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'services.html'));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));