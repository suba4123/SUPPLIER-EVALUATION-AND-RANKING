// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        companyName: "",
        role: "",
        purpose: ""
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Send registration data to server
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (data.success) {
                alert("Registration successful! Please login.");
                navigate("/login"); // Redirect to login after successful registration
            } else {
                alert("Registration failed. Try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <input
                type="text"
                placeholder="Purpose of Sorting"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
