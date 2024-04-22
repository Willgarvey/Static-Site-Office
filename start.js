"use strict"

document.addEventListener('DOMContentLoaded', function () {
    let searchInput = document.getElementById('searchInput'); // User input
    let dropdown = document.getElementById('dropdown'); // character select
    let searchButton = document.getElementById('searchButton'); // Button to trigger navigation

    
    // Retrieve the search text and selected character from the form
    populateCharacterOptions();

    // Function to populate the dropdown with character options
    function populateCharacterOptions() {
        dropdown.innerHTML = ''; // Clear existing options

        // Add the initial characters to the dropdown
        for (let i = 0; i < characterNames.length; i++) { // characterNames.js
            let character = characterNames[i];
            let option = document.createElement('option');
            option.value = character;
            option.textContent = character;
            dropdown.appendChild(option);
        }
    }

    searchInput.addEventListener('input', function () {
        searchText = searchInput.value;
    })

    searchInput.addEventListener('blur', function () {
        searchText = searchInput.value;
    })

    searchButton.addEventListener('click', function (searchText) {
        // Retrieve the search text and selected character from the form
        searchText = searchInput.value.toLowerCase();
        let selectedCharacter = dropdown.value;

        // Build the URL with query parameters
        let targetPage = 'file:///C:/Users/INTEL4400/Documents/Javascript%20Projects/Static-Site-Office/index.html'; // The page to navigate to
        let queryString = new URLSearchParams({
            search: searchText, // Add the search text to the query
            character: selectedCharacter // Add the selected character to the query
        }).toString();

        // Navigate to the target page with the query string
        window.location.href = `${targetPage}?${queryString}`;
    });

    
});