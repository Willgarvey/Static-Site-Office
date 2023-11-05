"use strict";

document.addEventListener('DOMContentLoaded', function () {

    let searchInput = document.getElementById('searchInput'); // User input
    let dropdown = document.getElementById('dropdown');

    let resultList = document.querySelector('.result-list'); // List of results

    let sidebarTitle = document.getElementById('selected-title');
    let sidebarCharacter = document.getElementById('selected-character'); // Sidebar details
    let sidebarEpisode = document.getElementById('selected-episode');
    let sidebarSeason = document.getElementById('selected-season');
    let sidebarScene = document.getElementById('selected-scene');
    let sidebarDiskNumber = document.getElementById('selected-disk-number');
    let sidebarDeleted = document.getElementById('selected-deleted');
    let sidebarLineID = document.getElementById('selected-id');

    let contextList = document.querySelector('.context-list'); // Context area

    let searchText = searchInput.value;
    populateCharacterOptions();

    searchInput.addEventListener('input', function () {
        searchText = searchInput.value;
    })

    searchInput.addEventListener('blur', function () {
        searchText = searchInput.value;
    })

    document.getElementById('searchButton').addEventListener('click', function (searchText) { // Press the Search button

        
        // Retrieve the search text and selected character from the form
        searchText = searchInput.value;
        let selectedCharacter = dropdown.value;

        // Create an instance of the Search class
        let search = new Search();

        // return the results of the search as an ordered list of indexes
        let result = search.searchScript(searchText, processedLines, selectedCharacter);

        if (result !== '' && selectedCharacter !== null) { // If there is a valid result
            let lines = search.getMatchingLines(result, scriptLines); // return the matching lines
            if (selectedCharacter != 'All Speakers'){
                lines = lines.filter(obj => obj.Speaker === selectedCharacter);
            }     
            assignSearchResults(lines);
            return lines;
        } else {
            let lines = '';
            assignSearchResults(lines);
            // console.log("Bad result. Something was not handled correctly.");
            return lines;
            }
    });
    // function to make matching wordsin results show as bold
    function addStrongTags(sentence, wordsToWrap) {
        const words = sentence.split(' ');
        const wrappedWords = words.map(word => {
          // Remove punctuation from the end of the word
          const cleanWord = word.replace(/[.,;!?]+$/, '')     
          if (wordsToWrap.indexOf(cleanWord) !== -1 || (wordsToWrap.toLowerCase()).indexOf(cleanWord.toLowerCase())  !== -1 || (wordsToWrap.toUpperCase()).indexOf(cleanWord.toUpperCase()) !== -1) {
            return `<strong>${word}</strong>`;
          }
          return word;
        });
        return wrappedWords.join(' ');
      } 
    // function to assign script lines the to results list
    function assignSearchResults(lines){       
        if (lines === null || lines === 'Invalid' || lines.length == 0) { //No results
            resultList.innerHTML = '';
            let paragraph = document.createElement('p');
            let bold = document.createElement('b');
            bold.textContent = 'No results,  Please try again.';
            paragraph.className = "result-zero";
            paragraph.appendChild(bold);
            resultList.appendChild(paragraph);
        }

        else { // write script lines to the list           
            let listCount = 0;
            resultList.innerHTML = '';
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                let className = i === 0 ? "result-item selected" : "result-item";
                let dataIndex = i;
                let lineText = addStrongTags(line.LineText, searchInput.value);
                let speaker = line.Speaker;
                let li = document.createElement('li');
                li.className = className;
                li.setAttribute('data-index', dataIndex);
                li.innerHTML = '<p class="description"><b>' + speaker + "</b>: " + lineText + '</p>';

                li.addEventListener('click', function () {  // Start Event listener for clickable list items
                    let selectedLi = resultList.querySelector('.result-item.selected');
                    if (selectedLi) {
                        selectedLi.classList.remove('selected');
                    }
                    this.classList.add('selected');
                    let selectedItem = lines[i];
          
                    sidebarTitle.textContent = selectedItem.Title; // Populate the sidebar with data of selected list item
                    sidebarSeason.textContent = selectedItem.Season;
                    sidebarEpisode.textContent = selectedItem.Episode;
                    sidebarScene.textContent = selectedItem.Scene;
                    sidebarCharacter.textContent = selectedItem.Speaker;
                    sidebarDiskNumber.textContent = selectedItem.Disk;
                    sidebarDeleted.textContent = selectedItem.IsDeleted ? "YES" : "NO";
                    sidebarLineID.textContent = selectedItem.LineID;

                    let selectedLine = scriptLines.find(obj => obj.LineID === parseInt(sidebarLineID.textContent)); //TODO: Use this elsewhere

                    // Assign values to the  context elements
                    contextList.innerHTML = "";
                    for (let i = -2; i<3; i++){
                        parseInt(selectedLine.LineID) + i
                        let line = scriptLines.find(obj => obj.LineID === parseInt(sidebarLineID.textContent) + i);
                        let className = "context-item";
                        let lineText = addStrongTags(line.LineText, searchInput.value);
                        let speaker = line.Speaker;
                        let li = document.createElement('li');
                        li.className = className;
                        li.innerHTML = '<p><b>' + speaker + "</b>: " + lineText + '</p>';
                        contextList.appendChild(li);
                    }
                });
                resultList.appendChild(li);
                listCount++;
                if(listCount === lines.length){
                    // Simulate a click event on the first list item
                    let firstListItem = resultList.querySelector('.result-item');
                    if (firstListItem) {
                        firstListItem.click();
                    }
                    return;
                    }
            }

            // Simulate a click event on the first list item
            let firstListItem = resultList.querySelector('.result-item');
            if (firstListItem) {
                firstListItem.click();
            }
        }
    }
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
});

