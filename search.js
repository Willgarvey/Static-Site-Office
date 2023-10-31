class Search {
    // constructor() {
    //   this.input = null;
    //   this.character = null;
    //   this.output = null;
    //   this.wordsList = null;
    //   this.matchList = null;
    //   this.matchIndexes = null;
    //   this.matchPercentage = 0;
    // }
  
    static splitAndCleanWords(textInput) {
      // Remove special characters except dashes using regex (kept as is)
      let cleanedText = textInput.replace(/[^a-zA-Z0-9\- ]/g, '');
      // Split the words into a list of strings
      let wordsList = cleanedText.split(' ').filter(word => word !== '');
      return wordsList;
    }
  
    static stringToList(inputString) {
      let wordList = [];
      // console.log("Input string: "+ inputString);
      let words = inputString.split(' ');
      for (let word of words) {
        wordList.push(word);
      }
      return wordList;
    }
  
    searchScript(textInput, processedLines, selectedCharacter) {
      let s = new Search();
      let dataList = [];
  
      s.input = textInput;
      s.wordsList = Search.splitAndCleanWords(s.input);
  
      // Return is there are no words in the list
      if (!s.wordsList.length) {
        s.output = 'Invalid';
        return s.output;
      }

      for (let line of processedLines) {
        let matchCount = 0;
        let matchIndex = line.id;
        s.matchList = [];
        // console.log("line.line_text = " + line.line_text);
        let lineList = Search.stringToList(line.line_text);
  
        for (let word of s.wordsList) {
          for (let item of lineList) {
            if (!s.matchList.includes(item.toLowerCase())) {
              if (word === item) {
                s.matchList.push(word.toLowerCase());
                matchCount++;
              }
            }
          }
        }
  
        s.matchPercentage = matchCount / lineList.length;
  
        if (matchCount > 0) {
          dataList.push({ matchIndex, matchCount, matchPercentage: s.matchPercentage });
        }
      }
  
      let sortedList = dataList
        .sort((a, b) => b.matchCount - a.matchCount || b.matchPercentage - a.matchPercentage || a.matchIndex - b.matchIndex);
  
      s.matchIndexes = sortedList.map(entry => entry.matchIndex);
      s.output = s.matchIndexes.join(',');
      return s.output;
    }
  
    addContextLines(sortedFinalResults) {
      let lines = sortedFinalResults;
      let numbers = lines.map(line => line.id);
      let copy = numbers.slice();
  
      for (let number of copy) {
        if (!numbers.includes(number + 1)) {
          numbers.push(number + 1);
        }
  
        if (!numbers.includes(number - 1)) {
          numbers.push(number - 1);
        }
      }
  
      numbers.sort((a, b) => a - b);
      let result = numbers.join(',');
      
      // return an ordered list of indexes to retrieve the search results from the raw script list
      return result;
    }

    getMatchingLines(result, scriptLines){
      let sortedFinalResults = [];
      let indices = result.split(",").map(index => parseInt(index, 10));
      for(let i=0; i<indices.length; i++){
        sortedFinalResults[i] = scriptLines[indices[i]];
      }
      return sortedFinalResults;
    }
  }
  