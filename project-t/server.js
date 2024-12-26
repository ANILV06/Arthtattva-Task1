const express = require("express");
const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.static("public")); // Serve static files like images

const mappings = {
  "A4 Paper": "A4 Sheets",
  "A4 Copy Paper": "A4 Sheets",
};

app.get("/mappings", (req, res) => {
  res.json(mappings);
});

app.post("/mappings", (req, res) => {
  const { supplierName, standardName } = req.body;
  if (!supplierName || !standardName) {
    return res.status(400).json({ error: "Both fields are required." });
  }
  mappings[supplierName] = standardName;
  res.json({ success: true });
});

app.get("/auto-match", (req, res) => {
  const query = req.query.q;
  const matches = Object.entries(mappings)
    .filter(([key]) => key.toLowerCase().includes(query.toLowerCase()))
    .map(([supplierName, standardName]) => ({ supplierName, standardName }));
  res.json(matches);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
