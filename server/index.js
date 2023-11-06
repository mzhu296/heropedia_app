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
// Search superheroes by name, race, publisher, or power
app.get('/api/search-superheroes', (req, res) => {
    const field = req.query.field;
    const pattern = req.query.pattern; 

    let matches = [];

    if (field === 'name') {
        matches = superheroInfo.filter(hero => hero.name.toLowerCase().includes(pattern.toLowerCase()));
    } else if (field === 'race') {
        matches = superheroInfo.filter(hero => hero.Race.toLowerCase().includes(pattern.toLowerCase()));
    } else if (field === 'publisher') {
        matches = superheroInfo.filter(hero => hero.Publisher.toLowerCase().includes(pattern.toLowerCase()));
    } else if (field === 'power') {
        const heroesWithPower = superheroPowers.filter(hero => hero[pattern] === 'True');
        const heroesWithPowerNames = heroesWithPower.map(hero => hero.hero_names);
    
        matches = superheroInfo.filter(hero => heroesWithPowerNames.includes(hero.name));
    }    

    res.json(matches);
});

// this method will create a new superhero list with a given name
let superheroLists = {}; // Object to store superhero lists

app.post('/api/create-superhero-list', (req, res) => {
    const listName = req.body.name;

    if (!listName) {
        return res.status(400).json({ error: 'List name is required.' });
    }

    if (superheroLists[listName]) {
        return res.status(409).json({ error: 'List name already exists.' });
    }

    superheroLists[listName] = []; // Create an empty list with the provided name
    res.status(201).json({ message: 'Superhero list created successfully.' });
});

// this method will save a list of superhero IDs to a given list name
app.put('/api/save-superhero-ids/:listName', (req, res) => {
    const listName = req.params.listName;
    const superheroIDs = req.body.ids; // Assuming you send the superhero IDs in the request body

    if (!superheroLists[listName]) {
        return res.status(404).json({ error: 'List name does not exist.' });
    }

    superheroLists[listName] = superheroIDs; // Replace existing superhero IDs with new ones
    res.status(200).json({ message: 'Superhero IDs saved successfully.' });
});

// this method will get the list of superhero IDs for a given list
app.get('/api/get-superhero-ids/:listName', (req, res) => {
    const listName = req.params.listName;

    if (!superheroLists[listName]) {
        return res.status(404).json({ error: 'List name does not exist.' });
    }

    const superheroIDs = superheroLists[listName];
    res.status(200).json({ listName, superheroIDs });
});

// this method will delete a superhero list with a given name
app.delete('/api/delete-superhero-list/:listName', (req, res) => {
    const listName = req.params.listName;

    if (!superheroLists[listName]) {
        return res.status(404).json({ error: 'List name does not exist.' });
    }

    delete superheroLists[listName];
    res.status(200).json({ message: 'Superhero list deleted successfully.' });
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientDir });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
