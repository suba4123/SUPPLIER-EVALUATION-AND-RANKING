import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierRanking from './SupplierRanking';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Supplier Score Ranking</h1>
      <h2>Select a Category</h2>
      <select onChange={handleCategoryChange} value={selectedCategory} style={{ padding: '10px', width: '100%', marginBottom: '20px' }}>
        <option value="">--Select a Category--</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Render SupplierRanking only when a category is selected */}
      {selectedCategory && <SupplierRanking category={selectedCategory} />}
    </div>
  );
};

export default App;
