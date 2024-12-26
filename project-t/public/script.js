const apiUrl = "http://localhost:3000"; // Backend URL
const supplierNameInput = document.getElementById("supplierName");
const standardNameInput = document.getElementById("standardName");
const addMappingBtn = document.getElementById("addMappingBtn");
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");
const mappingsList = document.getElementById("mappingsList");
const autoMatchResult = document.getElementById("autoMatchResult");
const resultImage = document.getElementById("resultImage");

// Fetch mappings from the backend
async function fetchMappings() {
  try {
    const response = await fetch(`${apiUrl}/mappings`);
    const mappings = await response.json();
    renderMappings(mappings);
  } catch (error) {
    console.error("Error fetching mappings:", error);
  }
}

// Render mappings on the UI
function renderMappings(mappings) {
  mappingsList.innerHTML = "";
  Object.entries(mappings).forEach(([key, value]) => {
    const li = document.createElement("li");
    li.textContent = `${key} → ${value}`;
    mappingsList.appendChild(li);
  });
}

// Add a new mapping
async function addMapping() {
  const supplierName = supplierNameInput.value.trim();
  const standardName = standardNameInput.value.trim();

  if (!supplierName || !standardName) {
    alert("Both fields are required!");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/mappings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierName, standardName }),
    });

    if (response.ok) {
      supplierNameInput.value = "";
      standardNameInput.value = "";
      fetchMappings();
    } else {
      const data = await response.json();
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error adding mapping:", error);
  }
}

// Search and get auto-matching results
async function searchMappings() {
  const query = searchBar.value.trim();
  if (!query) return;

  try {
    const response = await fetch(`${apiUrl}/auto-match?q=${encodeURIComponent(query)}`);
    const matches = await response.json();
    renderAutoMatches(matches);
  } catch (error) {
    console.error("Error searching mappings:", error);
  }
}

// Render auto-matching results
function renderAutoMatches(matches) {
  if (matches.length === 0) {
    autoMatchResult.querySelector("p").textContent = "No matches found.";
    resultImage.style.display = "none";
  } else {
    const firstMatch = matches[0];
    autoMatchResult.querySelector("p").textContent = `${firstMatch.supplierName} → ${firstMatch.standardName}`;
    resultImage.src = './public/images/a4-paper.jpg';
    resultImage.style.display = "block";
  }
}

// Event listeners
addMappingBtn.addEventListener("click", addMapping);
searchBtn.addEventListener("click", searchMappings);

// Initial fetch of mappings
fetchMappings();

