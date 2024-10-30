const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");  // Import User model
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Registration route
app.post("/register", async (req, res) => {
    try {
        const { username, password, email, name, role, companyName, purpose } = req.body;

        // Create new user
        const newUser = new User({
            username,
            password,  // Use plain password
            email,
            name,
            role,
            companyName,
            purpose
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check if password matches
        if (password !== user.password) return res.status(400).json({ error: "Invalid password" });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
