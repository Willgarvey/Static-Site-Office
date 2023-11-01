addContextLines(sortedFinalResults) {
    let lineIDs = sortedFinalResults.map(line => line.LineID); 
    let copy = lineIDs.slice(); 
    for (let lineID of copy) {
      if (!lineIDs.includes(lineID + 1)) {
        lineIDs.push(lineID + 1);
      } 
      if (!lineIDs.includes(lineID - 1)) {
        lineIDs.push(lineID - 1);
      }
    } 
    lineIDs.sort((a, b) => a - b);
    let result = lineIDs.join(',');
  
    return result;
  }