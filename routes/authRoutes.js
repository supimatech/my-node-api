const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this import path is correct

const router = express.Router();

// Register User Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Login User Route (Ensure this exists)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


