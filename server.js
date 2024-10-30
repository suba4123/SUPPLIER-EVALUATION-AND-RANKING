const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process'); // Import spawn to run Python scripts
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/supplierDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Supplier schema
const supplierSchema = new mongoose.Schema({
  final_price: Number,
  seller: String,
  product_id: String,
  product_name: String,
  category_name: String,
});

const Supplier = mongoose.model('Supplier', supplierSchema);

// Endpoint to test if server is working
app.get('/', (req, res) => {
  res.send('Welcome to the Supplier Score API!');
});

// Endpoint to get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Supplier.distinct('category_name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Function to run the Python script
const runPythonScript = (category) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [path.join(__dirname, 'supplier_score.py'), category]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python output: ${data}`);
      resolve(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      }
    });
  });
};

// Endpoint to rank suppliers
app.post('/rank-suppliers', async (req, res) => {
  const categoryName = req.body.category; // Extract category from the request body
  console.log(`Received category: ${categoryName}`);

  // Check if categoryName is defined
  if (!categoryName) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {
    // Run the Python script and get the JSON response
    const supplierRankings = await runPythonScript(categoryName);
    res.json(JSON.parse(supplierRankings)); // Send the JSON response back to the client
  } catch (error) {
    console.error('Error during ranking:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('404: Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
