let currentLineID = parseInt(sidebarLineID.textContent);

// Use findIndex to find the index of the object with the specified LineId
let index = scriptLines.findIndex(line => line.LineId === currentLineID);

if (index !== -1) {
console.log(`Index of object with LineId ${targetLineId} is: ${index}`);
} else {
console.log(`Object with LineId ${targetLineId} not found.`);
}