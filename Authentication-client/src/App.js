// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // After successful login
import "./App.css";


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the user is logged in (this could check for a token in local storage, for example)
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token); // Sets true if token exists
    }, []);

    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route 
                        path="/" 
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/login" 
                        element={<Login setIsAuthenticated={setIsAuthenticated} />} 
                    />
                    <Route 
                        path="/register" 
                        element={<Register />} 
                    />
                    <Route 
                        path="/dashboard" 
                        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
