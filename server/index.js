const express = require('express');
const app = express();
const port = 3000; 

// Load superhero data from JSON files
const path = require('path');
const superheroInfo = require('/Users/benjaminzhu/Documents/GitHub/se3316-mzhu296-lab3/server/superhero_info.json');
const superheroPowers = require('/Users/benjaminzhu/Documents/GitHub/se3316-mzhu296-lab3/server/superhero_powers.json');

// Define a route to get superhero information by ID
app.get('/api/superheroes/:id', (req, res) => {
    const superheroId = parseInt(req.params.id); // Parse the ID to an integer
    const superhero = superheroInfo.find(hero => hero.id === superheroId);

    if (superhero) {
        res.json(superhero);
    } else {
        res.status(404).json({ error: 'Superhero not found' });
    }
});

// Define a route to get superhero powers by ID
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

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
