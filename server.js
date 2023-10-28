const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));  // Serve static files

app.get('/api/data/:image_name', (req, res) => {
    // Retrieve data for the given image from the database
});

app.post('/api/data/:image_name', (req, res) => {
    // Store data for the given image in the database
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});