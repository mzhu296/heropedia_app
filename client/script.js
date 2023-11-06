// scripts.js

const baseURL = 'http://localhost:3000/api'; // Replace with your API endpoint

function searchSuperheroes() {
    const field = document.getElementById('searchField').value;
    const pattern = document.getElementById('searchInput').value;

    // Use fetch to send a GET request to the search endpoint on your back-end
    fetch(`${baseURL}/superheroes/search?field=${field}&pattern=${pattern}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data))
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.textContent = 'No results found.';
    } else {
        results.forEach(superhero => {
            const superheroElement = document.createElement('div');
            superheroElement.textContent = `Name: ${superhero.name}, Race: ${superhero.race}, Publisher: ${superhero.publisher}`;
            searchResults.appendChild(superheroElement);
        });
    }
}

// Additional functions to implement favorites and sorting go here...

// Call your back-end functions to create and retrieve lists, sort data, etc.

// Ensure to sanitize and validate user inputs to prevent security issues.
