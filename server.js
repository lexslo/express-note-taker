const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});