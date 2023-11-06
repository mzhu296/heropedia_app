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

function searchSuperheroes() {
    const searchField = document.getElementById('searchField').value;
    const searchPattern = document.getElementById('searchPattern').value;
    fetch(`/api/search-superheroes?field=${searchField}&pattern=${searchPattern}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('searchResult').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('searchResult').textContent = `Error: ${error.message}`;
        });
}
