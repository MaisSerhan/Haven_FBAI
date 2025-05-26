const express = require('express');
const path = require('path');

const app = express();

// Serve static files (CSS, JS, images, etc.) from project root folder
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});