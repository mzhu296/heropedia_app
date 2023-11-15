const express = require('express');
const app = express();
const port = 3000; 

//this method will Load superhero data from JSON files
const path = require('path');
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json');
const mainDir = path.join(__dirname, '../');
const clientDir = path.join(__dirname, '../client');
//const cors = require('cors');
app.use(express.static(mainDir));
app.use(express.static(clientDir));
//app.use(cors())

// Function to get superhero information by ID
function getSuperheroInfoById(superheroId) {
    return superheroInfo.find(hero => hero.id === superheroId);
}

// Function to get superhero powers by ID
function getSuperheroPowersById(superhero) {
    const superheroPower = superheroPowers.find((hero) => hero.hero_names.toLowerCase() === superhero.name.toLowerCase());
    return superheroPower ? Object.keys(superheroPower).filter(power => superheroPower[power] === 'True') : [];
}

// Route to get superhero information by ID
app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = getSuperheroInfoById(superheroId);

    if (superhero) {
        res.json(superhero);
    } else {
        res.status(404).json({ error: 'Superhero not found' });
    }
});

// Route to get superhero powers by ID
app.get('/api/superheroes/:id/powers', (req, res) => {
    const superheroId = parseInt(req.params.id);
    const superhero = getSuperheroInfoById(superheroId);

    if (superhero) {
        const powers = getSuperheroPowersById(superhero);
        res.json(powers);
    } else {
        res.status(404).json({ error: 'Power not found' });
    }
});

//this method will return all publisher names
app.get('/api/publishers', (req, res) => {
    const publishers = superheroInfo.map(hero => hero.Publisher);
    res.json(publishers);
});
//this method will search for superheroes by a specific field and pattern
app.get('/api/search-superheroes', (req, res) => {
    const field = req.query.field;
    const pattern = req.query.pattern;
    let matches = [];

    if (field === 'name') {
        matches = superheroInfo
            .filter(hero => hero.name.toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Gender') {
        matches = superheroInfo
            .filter(hero => hero.Gender.toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Eye color') {
        matches = superheroInfo
            .filter(hero =>  hero['Eye color'].toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Race') {
        matches = superheroInfo
            .filter(hero => hero.Race.toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Hair color') {
        matches = superheroInfo
            .filter(hero =>  hero['Hair color'].toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Height') {
        matches = superheroInfo
            .filter(hero => hero.Height.toString().includes(pattern.toString()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Publisher') {
        matches = superheroInfo
            .filter(hero =>  hero.Publisher.toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Skin color') {
        matches = superheroInfo
            .filter(hero =>  hero['Skin color'].toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Alignment') {
        matches = superheroInfo
            .filter(hero => hero.Alignment.toLowerCase().includes(pattern.toLowerCase()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Weight') {
        matches = superheroInfo
            .filter(hero => hero.Weight.toString().includes(pattern.toString()))
            .map(match => ({
                info: match,
                powers: superheroPowers.find(power => power.hero_names.toLowerCase() === match.name.toLowerCase())
            }));
    } else if (field === 'Power') {
        matches = superheroPowers
            .filter(hero => hero[pattern] === 'True')
            .map(powerMatch => {
                let match = superheroInfo.find(hero => hero.name.toLowerCase() === powerMatch.hero_names.toLowerCase());
                return match ? {
                    info: match,
                    powers: Object.keys(powerMatch).filter(power => powerMatch[power] === 'True')
                } : null;
            }).filter(Boolean); // This will remove any null values if a match was not found in superheroInfo
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
                    info: superhero,
                    powers: powers ? Object.keys(powers).filter(power => powers[power] === 'True') : []
                };
            }
            return null;
        }).filter(Boolean); 

        // Return a list of superhero details
        res.status(200).json(superheroDetails);
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
