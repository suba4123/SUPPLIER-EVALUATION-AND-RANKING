// backend/routes/auth.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    const newUser = new User({ username, password, email }); // Store password as plaintext

    try {
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    // Directly compare the plaintext password
    if (password !== user.password) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Logged in successfully" });
});

module.exports = router;
