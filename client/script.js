document.addEventListener('DOMContentLoaded', function () {
    const getInfoButton = document.getElementById('getInfoButton');
    const getPowersButton = document.getElementById('getPowersButton');
    const getPublishersButton = document.getElementById('getPublishersButton');
    const searchButton = document.getElementById('searchButton');

    getInfoButton.addEventListener('click', getSuperheroInfo);
    getPowersButton.addEventListener('click', getSuperheroPowers);
    getPublishersButton.addEventListener('click', getPublishers);
    searchButton.addEventListener('click', searchSuperheroes);
});

async function fetchAndDisplayData(url, resultElementId) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const resultElement = document.getElementById(resultElementId);
        resultElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        const resultElement = document.getElementById(resultElementId);
        resultElement.textContent = `Error: ${error.message}`;
    }
}

async function getSuperheroInfo() {
    const heroId = document.getElementById('heroId').value.trim();
    if (!heroId || heroId < 0) {
        displayError('infoResult', 'Please enter a valid numeric Superhero ID.');
        return;
    }
    const url = `/api/superheroes/${heroId}`;
    await fetchAndDisplayData(url, 'infoResult');
}

async function getSuperheroPowers() {
    const powersId = document.getElementById('powersId').value.trim();
    // This should likely be powersId instead of heroId in the condition.
    if (!powersId || powersId < 0) {
        displayError('powersResult', 'Please enter a valid numeric Superhero ID.');
        return;
    }
    const url = `/api/superheroes/${powersId}/powers`;
    await fetchAndDisplayData(url, 'powersResult');
}

async function getPublishers() {
    const url = '/api/publishers';
    await fetchAndDisplayData(url, 'publishersResult');
}

async function searchSuperheroes() {
    const searchField = document.getElementById('searchField').value;
    const searchPattern = document.getElementById('searchPattern').value;
    const resultLimit = parseInt(document.getElementById('resultLimit').value);
    const url = `/api/search-superheroes?field=${searchField}&pattern=${searchPattern}`;

    try {
        const response = await fetch(url);
        let data = await response.json();
        const limitedResults = data.slice(0, resultLimit); // Limit the results
        displaySearchResults(limitedResults);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    const searchResultElement = document.getElementById('searchResult');
    const sortBy = document.getElementById('sortBy').value.trim(); // Get the selected sort attribute
    searchResultElement.innerHTML = '';

    if (results.length === 0) {
        searchResultElement.textContent = 'No results found.';
    } 

    // Sort results by the attribute typed by the user, if it is valid
    results.sort((a, b) => {
        const valA = a.info[sortBy] ? a.info[sortBy].toString().toLowerCase() : '';
        const valB = b.info[sortBy] ? b.info[sortBy].toString().toLowerCase() : '';

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });
    
    results.forEach(hero => {
        const heroElement = document.createElement('div');

        // Construct a string for the hero's info
        const heroInfo = [];
        for (const key in hero.info) {
            if (hero.info.hasOwnProperty(key)) {
                heroInfo.push(`${key}: ${hero.info[key]}`);
            }
        }
        
        // Construct a string for the hero's powers
        const heroPowers = hero.powers ? Object.keys(hero.powers).filter(power => hero.powers[power] === 'True').join(', ') : 'None';
        heroElement.textContent = `Info: ${heroInfo.join(', ')}, Powers: ${heroPowers}`;
        searchResultElement.appendChild(heroElement);
    });
}

document.getElementById('sortBy').addEventListener('change', () => {
    // Assuming `searchResults` is the variable holding your data
    displaySearchResults(searchResults);
});

function displayMessage(message) {
    const messageElement = document.getElementById('messageArea');
    messageElement.textContent = message;
}

// Function to create a new list
async function createList() {
    const listName = document.getElementById('newListName').value;
    const response = await fetch(`/api/superhero-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8'  },
        body: JSON.stringify({ listName: listName })
    });
    const data = await response.json();
    displayMessage(data.message);
}

// Function to add superhero IDs to an existing list
async function addSuperheroesToList() {
    const listName = document.getElementById('existingListName').value;
    const ids = document.getElementById('superheroIds').value.split(',').map(Number);
    const response = await fetch(`/api/superhero-lists/${listName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ superheroIds: ids })
    });
    const data = await response.json();
    displayMessage(data.message);
}

// Function to get the details of a list
async function getListDetails() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`/api/superhero-lists/${listName}/details`);
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}

// Function to delete a list
async function deleteList() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`/api/superhero-lists/${listName}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    displayMessage(data.message);
}


