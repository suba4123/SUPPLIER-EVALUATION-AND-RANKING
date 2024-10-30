import React, { useState } from 'react';
import './App.css'; // Import your CSS file

const SupplierRanking = ({ category }) => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getSupplierRankings = async () => {
        if (!category.trim()) {
            alert('Please enter a category.');
            return;
        }

        setLoading(true);
        setError(''); // Reset any previous error

        try {
            const response = await fetch('http://localhost:5001/rank-suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rankings = await response.json();
            setRankings(rankings);
        } catch (error) {
            console.error('Error fetching rankings:', error);
            setError('Failed to fetch supplier rankings. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="supplier-container">
            <h1 className="supplier-title">Supplier Ranking</h1>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                style={{
                    padding: '10px',
                    width: '100%',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ff80bf',
                }}
            />
            <button
                onClick={getSupplierRankings}
                style={{
                    padding: '10px',
                    width: '100%',
                    backgroundColor: '#ff4081',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {loading ? 'Loading...' : 'Get Rankings'}
            </button>

            {error && <p style={{ color: '#ff1744', fontSize: '18px', marginTop: '20px' }}>{error}</p>}

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {rankings.map((supplier) => (
                    <li
                        key={supplier.seller}
                        style={{
                            padding: '15px',
                            backgroundColor: '#ffe6f2',
                            marginBottom: '12px',
                            borderRadius: '8px',
                            fontSize: '18px',
                            color: '#333',
                            border: '1px solid #ff80bf',
                            transition: 'background-color 0.3s ease, transform 0.2s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ffccdd')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffe6f2')}
                    >
                        {supplier.seller}: <span style={{ color: '#ff4081', fontWeight: 'bold' }}>{supplier.predicted_score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SupplierRanking;
