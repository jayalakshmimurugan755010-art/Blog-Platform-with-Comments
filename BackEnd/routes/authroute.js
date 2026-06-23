const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ message: "Account created successfully!", user: newUser });
    } catch (err) {
        res.status(400).json({ error: "Username already exists" });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
        res.json({ success: true, username: user.username });
    } else {
        res.status(401).json({ success: false, message: "Invalid username or password" });
    }
});

module.exports = router;