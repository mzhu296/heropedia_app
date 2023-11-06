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

function fetchAndDisplayData(url, resultElementId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultElement = document.getElementById(resultElementId);
            resultElement.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            const resultElement = document.getElementById(resultElementId);
            resultElement.textContent = `Error: ${error.message}`;
        });
}

function getSuperheroInfo() {
    const heroId = document.getElementById('heroId').value;
    const url = `/api/superheroes/${heroId}`;
    fetchAndDisplayData(url, 'infoResult');
}

function getSuperheroPowers() {
    const powersId = document.getElementById('powersId').value;
    const url = `/api/superheroes/${powersId}/powers`;
    fetchAndDisplayData(url, 'powersResult');
}

function getPublishers() {
    const url = '/api/publishers';
    fetchAndDisplayData(url, 'publishersResult');
}

function searchSuperheroes() {
    const searchField = document.getElementById('searchField').value;
    const searchPattern = document.getElementById('searchPattern').value;
    const resultLimit = parseInt(document.getElementById('resultLimit').value);
    const url = `/api/search-superheroes?field=${searchField}&pattern=${searchPattern}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const limitedResults = data.slice(0, resultLimit); // Limit the results
            displaySearchResults(limitedResults);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
}

function displaySearchResults(results) {
    const searchResultElement = document.getElementById('searchResult');
    searchResultElement.innerHTML = '';

    if (results.length === 0) {
        searchResultElement.textContent = 'No result found.';
    } else {
        results.forEach(hero => {
            const heroInfo = document.createElement('div');
            heroInfo.textContent = `Hero ID: ${hero.id}`;
            searchResultElement.appendChild(heroInfo);
        });
    }
}

// Base URL for the API
const apiUrl = 'http://localhost:3000/api';

// Function to create a new list
async function createList() {
    const listName = document.getElementById('newListName').value;
    const response = await fetch(`${apiUrl}/superhero-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName: listName })
    });
    const data = await response.json();
    alert(data.message);
}

// Function to add superhero IDs to an existing list
async function addSuperheroesToList() {
    const listName = document.getElementById('existingListName').value;
    const ids = document.getElementById('superheroIds').value.split(',').map(Number);
    const response = await fetch(`${apiUrl}/superhero-lists/${listName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ superheroIds: ids })
    });
    const data = await response.json();
    alert(data.message);
}

// Function to get the details of a list
async function getListDetails() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`${apiUrl}/superhero-lists/${listName}/details`);
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}

// Function to delete a list
async function deleteList() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`${apiUrl}/superhero-lists/${listName}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    alert(data.message);
}


