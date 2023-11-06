document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getInfoButton').addEventListener('click', getSuperheroInfo);
    document.getElementById('getPowersButton').addEventListener('click', getSuperheroPowers);
    document.getElementById('getPublishersButton').addEventListener('click', getPublishers);
    document.getElementById('searchButton').addEventListener('click', searchSuperheroes);
});

function getSuperheroInfo() {
    const heroId = document.getElementById('heroId').value;
    fetch(`/api/superheroes/${heroId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('infoResult').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('infoResult').textContent = `Error: ${error.message}`;
        });
}

function getSuperheroPowers() {
    const powersId = document.getElementById('powersId').value;
    fetch(`/api/superheroes/${powersId}/powers`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('powersResult').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('powersResult').textContent = `Error: ${error.message}`;
        });
}

function getPublishers() {
    fetch(`/api/publishers`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('publishersResult').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('publishersResult').textContent = `Error: ${error.message}`;
        });
}

document.getElementById('searchButton').addEventListener('click', function () {
    const searchField = document.getElementById('searchField').value;
    const searchPattern = document.getElementById('searchPattern').value;

    fetch(`/api/search-superheroes?field=${searchField}&pattern=${searchPattern}`)
        .then(response => response.json())
        .then(data => {
            // Handle the search results here, e.g., display them on the page.
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
});

function displaySearchResults(results) {
    const searchResultElement = document.getElementById('searchResult');
    // Clear previous results
    searchResultElement.innerHTML = '';

    if (results.length === 0) {
        searchResultElement.textContent = 'No result found.';
    } else {
        // Loop through the search results and display them as needed
        results.forEach(hero => {
            const heroInfo = document.createElement('div');
            heroInfo.textContent = `Name: ${hero.name}, Race: ${hero.Race}, Publisher: ${hero.Publisher}, Power: ${hero.power}`;
            searchResultElement.appendChild(heroInfo);
        });
    }
}

// Functions to interact with the API

async function createSuperheroList() {
    const listName = document.getElementById('listName').value;
    try {
        const response = await fetch('/api/create-superhero-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: listName })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveSuperheroIdsToList() {
    const listName = document.getElementById('listNameForIds').value;
    const superheroIds = document.getElementById('superheroIds').value.split(',');

    try {
        const response = await fetch(`/api/save-superhero-ids/${listName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: superheroIds })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getSuperheroIdsFromList() {
    const listName = document.getElementById('listNameForGetIds').value;

    try {
        const response = await fetch(`/api/get-superhero-ids/${listName}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteSuperheroList() {
    const listName = document.getElementById('listNameForDelete').value;

    try {
        const response = await fetch(`/api/delete-superhero-list/${listName}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
