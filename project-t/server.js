const express = require('express');
const cors = require('cors'); // Import cors

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Use JSON middleware to parse request bodies
app.use(express.json());

// In-memory store for mappings (for demonstration)
let mappings = {};

// API route for fetching mappings
app.get('/mappings', (req, res) => {
  res.json(mappings);
});

// API route for adding new mappings
app.post('/mappings', (req, res) => {
  const { supplierName, standardName } = req.body;
  if (!supplierName || !standardName) {
    return res.status(400).json({ error: 'Both fields are required!' });
  }
  mappings[supplierName] = standardName;
  res.json({ message: 'Mapping added successfully!' });
});

// API route for auto-matching based on search query
app.get('/auto-match', (req, res) => {
  const query = req.query.q?.toLowerCase();
  const results = [];
  
  if (query) {
    for (let [key, value] of Object.entries(mappings)) {
      if (key.toLowerCase().includes(query)) {
        results.push({ supplierName: key, standardName: value });
      }
    }
  }

  res.json(results);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
