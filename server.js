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
    fs.writeFile(
        path.join(__dirname, './db/db.json'),
        // save the array data as JSON, null = no editing, 2 = create space to be legible
        JSON.stringify(notesArray, null, 2),
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );

    return note;
}

function deleteNote(id, notesArray) {
    console.log('ID from deleteNote function: ' + id);
    const newNotesArray = notesArray.filter(element => element.id !== id);

    fs.writeFile(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(newNotesArray, null, 2),
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
}

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    console.log(notes);
    // set id to be one more than the last note id value
    let lastNote = notes.length - 1;
    let lastNoteId = parseInt(notes[lastNote].id);
    let nextId = lastNoteId + 1;
    req.body.id = nextId.toString();
    // add note to json file and notes array in this function
    const note = createNewNote(req.body, notes);
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    deleteNote(noteId, notes);
    res.send(`Note ID ${noteId} deleted`);
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