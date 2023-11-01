class Search {
    static splitAndCleanWords(textInput) {
      let cleanedText = textInput.replace(/[^a-zA-Z0-9\- ]/g, ''); // remove special characters from input     
      let wordsList = cleanedText.split(' ').filter(word => word !== ''); // Split the words into a list of strings
      return wordsList;
    }
    static stringToList(inputString) {
      let wordList = [];
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
        
      if (!s.wordsList.length) {
        return s.output = 'Invalid'; // Return if there are no words in cleaned input
      }

      for (let line of processedLines) {
        let matchCount = 0;
        let matchIndex = line.id;
        s.matchList = [];
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
        if (matchCount > 0) {
          s.matchPercentage = matchCount / lineList.length;
          dataList.push({ matchIndex, matchCount, matchPercentage: s.matchPercentage });
        }
      }
      let sortedList = dataList.sort((a, b) => b.matchCount - a.matchCount || b.matchPercentage - a.matchPercentage || a.matchIndex - b.matchIndex);
      s.matchIndexes = sortedList.map(entry => entry.matchIndex);
      s.output = s.matchIndexes.join(',');
      return s.output;
    }  
    getMatchingLines(result, scriptLines){
      let sortedFinalResults = [];
      let indices = result.split(",").map(index => parseInt(index, 10));
      for(let i=0; i<indices.length; i++){
        if (i<100){
          sortedFinalResults[i] = scriptLines.find(obj => obj.LineID === indices[i]);
        }
      }
      return sortedFinalResults;
    }
  }
  