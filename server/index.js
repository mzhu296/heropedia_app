const express = require('express');
const app = express();
const port = 3000; 

//this method will Load superhero data from JSON files
const path = require('path');
const superheroInfo = require('/Users/benjaminzhu/Documents/GitHub/se3316-mzhu296-lab3/server/superhero_info.json');
const superheroPowers = require('/Users/benjaminzhu/Documents/GitHub/se3316-mzhu296-lab3/server/superhero_powers.json');

const mainDir = path.join(__dirname, '../');
const clientDir = path.join(__dirname, '../client');
app.use(express.static(mainDir));
app.use(express.static(clientDir));

//this method will get superhero information by ID
app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id); // Parse the ID to an integer
    const superhero = superheroInfo.find(hero => hero.id === superheroId);

    if (superhero) {
        res.json(superhero);
    } else {
        res.status(404).json({ error: 'Superhero not found' });
    }
});

//this method will get superhero powers by ID
app.get('/api/superheroes/:id/powers', (req, res) => {
    const superheroId = parseInt(req.params.id); // Parse the ID to an integer
    const superhero = superheroInfo.find(hero => hero.id === superheroId);
    const superheroPower = superheroPowers.find((hero) => hero.hero_names.toLowerCase() === superhero.name.toLowerCase());
    const powers = Object.keys(superheroPower).filter(power => superheroPower[power] === 'True');

    if (powers) {
        res.json(powers);
    } else {
        res.status(404).json({ error: 'Powers not found' });
    }
});

//this method will return all publisher names
app.get('/api/publishers', (req, res) => {
    const publishers = superheroInfo.map(hero => hero.Publisher);
    res.json(publishers);
});

//this method will search for superheroes by a specific field and pattern
app.get('/api/search-superheroes', (req, res) => {
    const field = req.query.field; // Get the field parameter from the query string
    const pattern = req.query.pattern; // Get the pattern parameter from the query string
    const n = parseInt(req.query.n); // Get the 'n' parameter from the query string

    if (!field || !pattern) {
        return res.status(400).json({ error: 'Both field and pattern are required.' });
    }

    const matches = superheroInfo.filter(hero => {
        // Use a case-insensitive regular expression to match the pattern in the specified field
        const regex = new RegExp(pattern, 'i');
        return regex.test(hero[field]);
    });

    if (n) {
        res.json(matches.slice(0, n)); // Return the first 'n' matches
    } else {
        res.json(matches); // Return all matches
    }
});

// this method will create a new superhero list with a given name
app.post('/api/create-superhero-list', (req, res) => {
    const listName = req.body.name; // Get the list name from the request body

    if (!listName) {
        return res.status(400).json({ error: 'List name is required.' });
    }

    if (superheroLists[listName]) {
        return res.status(409).json({ error: 'List name already exists.' });
    }

    superheroLists[listName] = []; // Create an empty list with the provided name
    res.status(201).json({ message: 'Superhero list created successfully.' });
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientDir });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
