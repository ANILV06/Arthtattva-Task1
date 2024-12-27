const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = "mongodb://127.0.0.1:27017/productMappingDB";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define the Schema
const mappingSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  standardName: { type: String, required: true },
});

// Create a Model
const Mapping = mongoose.model("Mapping", mappingSchema);

// API Endpoints

// Get all mappings
app.get("/mappings", async (req, res) => {
  try {
    const mappings = await Mapping.find();
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mappings" });
  }
});

// Add a new mapping
app.post("/mappings", async (req, res) => {
  const { supplierName, standardName } = req.body;

  if (!supplierName || !standardName) {
    return res.status(400).json({ error: "Both fields are required" });
  }

  try {
    const newMapping = new Mapping({ supplierName, standardName });
    await newMapping.save();
    res.json({ message: "Mapping added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add mapping" });
  }
});

// Search for a mapping
app.get("/auto-match", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const matches = await Mapping.find({
      supplierName: new RegExp(query, "i"), // Case-insensitive search
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Failed to search mappings" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  