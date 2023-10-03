const express = require('express');
const path = require('path');

const app = express();

// Serve static assets from the "dist" folder
app.use('/', express.static(path.join(__dirname, '/dist')));

// All routes go to index.html for Vue.js to handle
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
