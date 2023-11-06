const express = require('express');
const app = express();
const port = 3000; 

//this method will Load superhero data from JSON files
const path = require('path');
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json');
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

// This object will act as an in-memory storage for superhero lists
let superheroLists = {};

// Endpoint to create a new superhero list
app.post('/api/superhero-lists', express.json(), (req, res) => {
    const listName = req.body.listName;

    // Check if the list name already exists
    if (superheroLists.hasOwnProperty(listName)) {
        // If the list name exists, return an error response
        res.status(409).json({ error: 'List name already exists' });
    } else {
        // If the list name does not exist, create it with an empty array
        superheroLists[listName] = [];

        // Return a success response
        res.status(201).json({ message: 'List created successfully', listName: listName });
    }
});

app.post('/api/superhero-lists/:listName', express.json(), (req, res) => {
    const listName = req.params.listName;
    const superheroIds = req.body.superheroIds;

    // Check if the list name exists
    if (!superheroLists.hasOwnProperty(listName)) {
        // If the list name does not exist, return an error response
        res.status(404).json({ error: 'List name does not exist' });
    } else {
        // If the list name exists, replace its contents with the new superhero IDs
        superheroLists[listName] = superheroIds;

        // Return a success response
        res.status(200).json({ message: 'List updated successfully', listName: listName });
    }
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientDir });
});

app.get('/api/superhero-lists/:listName', (req, res) => {
    const listName = req.params.listName;

    // Check if the list name exists
    if (!superheroLists.hasOwnProperty(listName)) {
        res.status(404).json({ error: 'List not found' });
    } else {
        res.status(200).json(superheroLists[listName]);
    }
});

app.delete('/api/superhero-lists/:listName', (req, res) => {
    const listName = req.params.listName;

    // Check if the list name exists
    if (!superheroLists.hasOwnProperty(listName)) {
        res.status(404).json({ error: 'List not found' });
    } else {
        // If the list name exists, delete it
        delete superheroLists[listName];

        // Return a success response
        res.status(200).json({ message: 'List deleted successfully' });
    }
});

app.get('/api/superhero-lists/:listName/details', (req, res) => {
    const listName = req.params.listName;

    // Check if the list name exists
    if (!superheroLists.hasOwnProperty(listName)) {
        res.status(404).json({ error: 'List not found' });
    } else {
        // Get the list of superhero IDs
        const superheroIds = superheroLists[listName];

        // Map IDs to superhero details
        const superheroDetails = superheroIds.map(id => {
            const superhero = superheroInfo.find(hero => hero.id === id);
            if (superhero) {
                const powers = superheroPowers.find(power => power.hero_names.toLowerCase() === superhero.name.toLowerCase());
                return {
                    id: superhero.id,
                    name: superhero.name,
                    info: superhero,
                    powers: powers ? Object.keys(powers).filter(power => powers[power] === 'True') : []
                };
            }
            return null;
        }).filter(Boolean); // Filter out any null values if a superhero wasn't found

        // Return a list of superhero details
        res.status(200).json(superheroDetails);
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
