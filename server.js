const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    // write the data to the notes.json file in the data directory
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        // save the array data as JSON, null = no editing, 2 = create space to be legible
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

app.get('/api/notes', (req,res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    // set id to be one more than the highest id value
    req.body.id = notes.length.toString();
    // add note to json file and notes array in this function
    const note = createNewNote(req.body, notes);
    res.json(note);
});

// set homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
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