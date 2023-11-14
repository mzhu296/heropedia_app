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

let myurl = window.location.hostname;

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
    const url = `http://${myurl}:3000/api/superheroes/${heroId}`;
    await fetchAndDisplayData(url, 'infoResult');
}

async function getSuperheroPowers() {
    const powersId = document.getElementById('powersId').value.trim();
    const url = `http://${myurl}:3000/api/superheroes/${powersId}/powers`;
    await fetchAndDisplayData(url, 'powersResult');
}

async function getPublishers() {
    const url = `http://${myurl}:3000/api/publishers`;
    await fetchAndDisplayData(url, 'publishersResult');
}

async function searchSuperheroes() {
    const searchField = document.getElementById('searchField').value;
    const searchPattern = document.getElementById('searchPattern').value;
    const resultLimit = parseInt(document.getElementById('resultLimit').value);
    const url = `http://${myurl}:3000/api/search-superheroes?field=${searchField}&pattern=${searchPattern}`;
    const response = await fetch(url);
    let data = await response.json();
    const limitedResults = data.slice(0, resultLimit); // Limit the results
    for (let i = 0; i < data.length; i++) {
        data[i].info["Power"] = countTruePowers(data[i].powers); 
    }
    displaySearchResults(limitedResults);
}

function displaySearchResults(results) {
    const searchResultElement = document.getElementById('searchResult');
    const sortBy = document.getElementById('sortBy').value.trim();
    searchResultElement.innerHTML = '';

    if (results.length === 0) {
        searchResultElement.textContent = 'No results found.';
        return;
    }

    sortListByAttribute(results, sortBy);
    
    results.forEach(hero => {
        const heroElement = document.createElement('div');
        const heroInfo = Object.entries(hero.info)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        
        heroElement.textContent = `Info: ${heroInfo}`;
        searchResultElement.appendChild(heroElement);
    });
}

document.getElementById('sortBy').addEventListener('change', () => {
    displaySearchResults(searchResults);
});

// Function to create a new list
async function createList() {
    const listName = document.getElementById('newListName').value;
    const response = await fetch(`http://${myurl}:3000/api/superhero-lists`, {
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
    const response = await fetch(`http://${myurl}:3000/api/superhero-lists/${listName}`, {
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
    const response = await fetch(`http://${myurl}:3000/api/superhero-lists/${listName}`, {
        method: 'GET'
    });
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}

// Function to get the details of a list
async function getListDetails() {
    const listName = document.getElementById('manageListName').value;
    const response = await fetch(`http://${myurl}:3000/api/superhero-lists/${listName}/details`);
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
    let len = list.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            let valA = list[j].info && list[j].info[attribute];
            let valB = list[j+1].info && list[j+1].info[attribute];
            // Check if the attribute should be compared as numbers.
            if (attribute === 'Power') {
                valA = Number(valA);
                valB = Number(valB);
            } else {
                valA = valA ? valA.toString().toLowerCase() : '';
                valB = valB ? valB.toString().toLowerCase() : '';
            }
            if (valA > valB) {
                // Swap the elements
                let temp = list[j];
                list[j] = list[j + 1];
                list[j + 1] = temp;
            }
        }
    }
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
    const response = await fetch(`http://${myurl}:3000/api/superhero-lists/${listName}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    const detailsElement = document.getElementById('listDetails');
    detailsElement.textContent = JSON.stringify(data, null, 2);
}


