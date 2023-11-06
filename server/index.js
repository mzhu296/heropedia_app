const express = require('express');
const app = express();
const port = 3000; 

//this method will Load superhero data from JSON files
const path = require('path');
const fs = require('fs');
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json');
const mainDir = path.join(__dirname, '../');
const clientDir = path.join(__dirname, '../client');
app.use(express.static(mainDir));
app.use(express.static(clientDir));
app.use(express.json());

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

const dataFilePath = 'superhero_lists.json';

// Load superhero data from the JSON file
function loadSuperheroData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Save superhero data to the JSON file
function saveSuperheroData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Create a new list of superheroes
app.post('/api/lists/:listName', (req, res) => {
  const listName = req.params.listName;
  const superheroData = loadSuperheroData();

  if (superheroData.hasOwnProperty(listName)) {
    res.status(400).json({ error: 'List name already exists' });
  } else {
    superheroData[listName] = [];
    saveSuperheroData(superheroData);
    res.sendStatus(201);
  }
});

// Save a list of superhero IDs to a given list name
app.put('/api/lists/:listName', (req, res) => {
  const listName = req.params.listName;
  const superheroIds = req.body.superheroIds;
  const superheroData = loadSuperheroData();

  if (!superheroData.hasOwnProperty(listName)) {
    res.status(404).json({ error: 'List does not exist' });
  } else {
    superheroData[listName] = superheroIds;
    saveSuperheroData(superheroData);
    res.sendStatus(200);
  }
});

// Get the list of superhero IDs for a given list
app.get('/api/lists/:listName', (req, res) => {
  const listName = req.params.listName;
  const superheroData = loadSuperheroData();

  if (!superheroData.hasOwnProperty(listName)) {
    res.status(404).json({ error: 'List does not exist' });
  } else {
    const superheroIds = superheroData[listName];
    res.json({ superheroIds });
  }
});

// Delete a list of superheroes with a given name
app.delete('/api/lists/:listName', (req, res) => {
  const listName = req.params.listName;
  const superheroData = loadSuperheroData();

  if (!superheroData.hasOwnProperty(listName)) {
    res.status(404).json({ error: 'List does not exist' });
  } else {
    delete superheroData[listName];
    saveSuperheroData(superheroData);
    res.sendStatus(204);
  }
});

// Get a list of names, information, and powers of all superheroes saved in a given list
app.get('/api/lists/:listName/superheroes', (req, res) => {
  const listName = req.params.listName;
  const superheroData = loadSuperheroData();

  if (!superheroData.hasOwnProperty(listName)) {
    res.status(404).json({ error: 'List does not exist' });
  } else {
    // You can retrieve superhero details from another data source and filter based on superhero IDs in the list.
    const superheroIds = superheroData[listName];
    // Sample response - Replace with actual data retrieval
    const superheroes = superheroDetails.filter((hero) => superheroIds.includes(hero.id));
    res.json({ superheroes });
  }
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientDir });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
