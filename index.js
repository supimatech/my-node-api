const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables

const authMiddleware = require('./middleware/authMiddleware'); // Import middleware
const authRoutes = require('./routes/authRoutes'); // Import authentication routes

const app = express(); // ✅ Initialize Express first!

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// ✅ Define Routes AFTER initializing `app`
app.use('/api/auth', authRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'You have access to this protected route!', user: req.user });
});

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.EXISTING_DB_URI;

// Connect to MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Database connection error:', err));

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

