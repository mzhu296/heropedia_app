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
    const url = `/api/superheroes/${heroId}`;
    await fetchAndDisplayData(url, 'infoResult');
}

async function getSuperheroPowers() {
    const powersId = document.getElementById('powersId').value.trim();
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
        const limitedResults = data.slice(0, resultLimit);
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
    for (let i = 0; i < results.length; i++) {
        results[i].info["Power"] = countTruePowers(results[i].powers); 
    }
    if (sortBy) {
        sortListByAttribute(results, sortBy);
    }
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

// Function to create a new list
async function createList() {
    const listName = document.getElementById('newListName').value;
    const response = await fetch(`/api/superhero-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8'  },
        body: JSON.stringify({ listName: listName })
    });
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
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
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}

// Function to get a list
async function getList() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`/api/superhero-lists/${listName}`, {
        method: 'GET'
    });
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}

// Function to get the details of a list
async function getListDetails() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`/api/superhero-lists/${listName}/details`);
    const attributeToSortBy = document.getElementById('sortAttribute').value.trim();
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        data[i].info["Power"] = countTruePowers2(data[i].powers); 
    }
    sortListByAttribute(data,  attributeToSortBy); 
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}

function sortListByAttribute(list, attribute) {
    // Assuming that we're dealing with an array of objects
    list.sort((a, b) => {
        const valA = (a.info && a.info[attribute]) ? a.info[attribute].toString().toLowerCase() : '';
        const valB = (b.info && b.info[attribute]) ? b.info[attribute].toString().toLowerCase() : '';
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });
}

function countTruePowers(powers) {
    return Object.values(powers).reduce((count, powerValue) => {
      // Increment count if powerValue is "True"
      if (powerValue === "True") {
        return count +1;
      }
      return count;
    }, 0);
  }

function countTruePowers2(powers) {
    // Assuming 'powers' is an object with boolean values
    return Object.values(powers).filter(isPower => isPower).length;
}

// Function to delete a list
async function deleteList() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`/api/superhero-lists/${listName}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}


