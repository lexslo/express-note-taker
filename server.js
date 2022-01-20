const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/notes', (req,res) => {
    res.json(notes);
})

// set homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})
// return notes.html when user goes to url/notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// failsafe to take user back to homepage if non-existent filepath is attempted
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});