"use strict";

document.addEventListener('DOMContentLoaded', function () {

    // --- Selectors
    let searchInput = document.getElementById('searchInput');
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

    let previousSpeakerElement = document.getElementById('previous-speaker'); // Context area
    let previousLineElement = document.getElementById('previous-line');
    let currentSpeakerElement = document.getElementById('current-speaker');
    let currentLineElement = document.getElementById('current-line');
    let nextSpeakerElement = document.getElementById('next-speaker');
    let nextLineElement = document.getElementById('next-line');

    let lowerButtonUp = document.getElementById('lower-button-up');
    let lowerButtonDown = document.getElementById('lower-button-down');

    populateCharacterOptions();


    // Up arrow button for script linesin context
    lowerButtonUp.addEventListener('click', function () {
        assignContextResults("up"); 
    });
    // Down arrow button for script lines in context
    lowerButtonDown.addEventListener('click', function () {      
        assignContextResults("down");    
    });
    // Search
    document.getElementById('searchButton').addEventListener('click', function () {

        
        // Retrieve the search text and selected character from the form
        let searchText = searchInput.value;
        let selectedCharacter = dropdown.value;

        // Create an instance of the Search class
        let search = new Search();

        // return the results of the search as an ordered list of indexes
        let result = search.searchScript(searchText, processedLines, selectedCharacter);

        // Handle if the result is "Invalid" (not using unique words)
        if (result === 'Invalid') {
            showInvalidResult();
            return;
        }

        // If there is a valid result
        if (result !== '' && selectedCharacter !== null) {
            let lines = search.getMatchingLines(result, scriptLines); // return the matching lines
            console.log(selectedCharacter);     
            assignSearchResults(lines);
            return lines;
        } else {
            console.log("Bad result. Something was not handled correctly.");
            return
            }
    });
    // function to assign script lines to the bottom half of the screen
    function assignContextResults(button) {
        let currentLineID = parseInt(sidebarLineID.textContent);
            if (currentLineID >= 1) {
                if (button === "up")
                {
                    currentSpeakerElement.innerHTML = scriptLines[currentLineID - 1].Speaker;
                    currentLineElement.innerHTML = scriptLines[currentLineID - 1].LineText;

                    nextSpeakerElement.innerHTML = scriptLines[currentLineID].Speaker;
                    nextLineElement.innerHTML = scriptLines[currentLineID].LineText;

                    try {
                        previousSpeakerElement.innerHTML = scriptLines[currentLineID - 2].Speaker;
                        previousLineElement.innerHTML = scriptLines[currentLineID - 2].LineText;
                    }

                    catch {
                        previousSpeakerElement.innerHTML = "";
                        previousLineElement.innerHTML = "<b>Beginning of Scene<//b>";
                        sidebarLineID.textContent = currentLineID + 1;
                    }

                    sidebarLineID.textContent = currentLineID - 1;
                }

                else if (button === "down")
                {
                    currentSpeakerElement.innerHTML = scriptLines[currentLineID + 1].Speaker;
                    currentLineElement.innerHTML = scriptLines[currentLineID + 1].LineText;

                    try {
                        nextSpeakerElement.innerHTML = scriptLines[currentLineID + 2].Speaker;
                        nextLineElement.innerHTML = scriptLines[currentLineID + 2].LineText;
                    }

                    catch {
                        nextSpeakerElement.innerHTML = "";
                        nextLineElement.innerHTML = "<b>End of Scene<//b>";
                        sidebarLineID.textContent = currentLineID - 1;
                    }


                    previousSpeakerElement.innerHTML = scriptLines[currentLineID].Speaker;
                    previousLineElement.innerHTML = scriptLines[currentLineID].LineText;

                    sidebarLineID.textContent = currentLineID + 1;
                }
            }
    }
    // function to assign script lines the to results list
    function assignSearchResults(lines){       
        if (lines === null) { // Do something with no results
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
                let lineText = line.LineText;
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
                    sidebarDiskNumber.textContent = selectedItem.Dvd;
                    sidebarDeleted.textContent = selectedItem.IsDeleted;
                    sidebarLineID.textContent = selectedItem.LineID;
                    
                    let selectedLine = scriptLines[lines[i].LineID - 1];
                    let previousLine = scriptLines[lines[i].LineID];
                    let nextLine = scriptLines[lines[i].LineID - -1];

                    let selectedSpeaker = selectedLine.Speaker; // Select the speaker
                    let selectedLineText = selectedLine.LineText; // Select the line

                    // Retrieve the Speaker and LineText properties for the previous line
                    let previousSpeaker = previousLine ? previousLine.Speaker : "";
                    let previousLineText = previousLine ? previousLine.LineText : "";

                    // Retrieve the Speaker and LineText properties for the next line
                    let nextSpeaker = nextLine ? nextLine.Speaker : "";
                    let nextLineText = nextLine ? nextLine.LineText : "";

                    // Assign values to the elements
                    previousSpeakerElement.textContent = previousSpeaker;
                    previousLineElement.textContent = previousLineText;
                    currentSpeakerElement.textContent = selectedSpeaker;
                    currentLineElement.textContent = selectedLineText;
                    nextSpeakerElement.textContent = nextSpeaker;
                    nextLineElement.textContent = nextLineText;
                });
                resultList.appendChild(li);
                listCount++;
                if(listCount === lines.length || listCount > 100){
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

