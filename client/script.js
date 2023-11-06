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

document.addEventListener('DOMContentLoaded', () => {
    // Populate the select dropdown with existing lists
    const listSelector = document.getElementById('listSelector');
    fetch(`/api/lists`)
        .then(response => response.json())
        .then(data => {
            data.forEach(list => {
                const option = document.createElement('option');
                option.value = list;
                option.text = list;
                listSelector.appendChild(option);
            });
        });
});

function createList() {
    const newListName = document.getElementById('newListName').value;
    if (newListName) {
        fetch(`/api/lists/${newListName}`, { method: 'POST' })
            .then(response => {
                if (response.status === 201) {
                    alert('List created successfully');
                } else if (response.status === 400) {
                    alert('List name already exists');
                }
            });
    }
}

function saveSuperheroIds() {
    const listName = document.getElementById('listSelector').value;
    const superheroIds = document.getElementById('superheroIds').value;
    if (listName && superheroIds) {
        const requestBody = { superheroIds: superheroIds.split(',').map(id => id.trim()) };
        fetch(`/api/lists/${listName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (response.status === 200) {
                    alert('Superhero IDs saved successfully');
                } else if (response.status === 404) {
                    alert('List does not exist');
                }
            });
    }
}

function getSuperheroIds() {
    const listName = document.getElementById('listSelector').value;
    if (listName) {
        fetch(`/api/lists/${listName}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 404) {
                    alert('List does not exist');
                    return null;
                }
            })
            .then(data => {
                if (data) {
                    const superheroIds = data.superheroIds.join(', ');
                    alert(`Superhero IDs in the list: ${superheroIds}`);
                }
            });
    }
}

function deleteList() {
    const listName = document.getElementById('listSelector').value;
    if (listName) {
        fetch(`/api/lists/${listName}`, { method: 'DELETE' })
            .then(response => {
                if (response.status === 204) {
                    alert('List deleted successfully');
                    // Remove the deleted list from the dropdown
                    const listSelector = document.getElementById('listSelector');
                    const optionToRemove = Array.from(listSelector.options).find(option => option.value === listName);
                    if (optionToRemove) {
                        listSelector.removeChild(optionToRemove);
                    }
                } else if (response.status === 404) {
                    alert('List does not exist');
                }
            });
    }
}
