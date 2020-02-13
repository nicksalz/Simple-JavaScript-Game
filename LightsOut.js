// Add an event listener for the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", domLoaded);

// Declare the object that stores information about the current game 
let currentGame = {
   "rowCount": 7,
   "columnCount": 7,
   "lights": [
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true
   ],
   "startTime": new Date()
};

// Returns true if all lights in the game grid are off, false otherwise.
function allLightsOut(game) {
   for (let i = 0; i < game.lights.length; i++) {
      // Even 1 light being on implies that not all are out/off
      if (game.lights[i])
         return false;
   }
   
   // All lights were checked and none are on, so lights are out!
   return true;
}

// Updates the HTML table's cells based on game.lights
function arrayToTable(game) {
   // Get the HTML table
   const gameTable = document.getElementById("gameTable");
   
   // Copy from game's light array entries into the table
   for (let i = 0; i < game.lights.length; i++) {
      const row = gameTable.rows[Math.floor(i / game.columnCount)];
      const cell = row.cells[i % game.columnCount];
      
      // Update the cell's style based on the light state
      if (game.lights[i])
         cell.className = "lightOn";
      else
         cell.className = "lightOff";
   }
}

// Handles table click events
function cellClicked(e) {
   // Process HTMLTableCellElement clicks only
   if (e.target instanceof HTMLTableCellElement) {
      const cell = e.target;
      
      // Determine row and column indices
      const column = cell.cellIndex;
      const row = cell.parentNode.rowIndex;
      
      // Call clickLight, passing the indices
      clickLight(row, column);
   }
}

// Handles a click at the specified location. Toggles lights, updates
// the HTML table on the page, and checks to see if the game is won.
function clickLight(row, column) {
   // Ignore if the game is already won
   if (allLightsOut(currentGame))
      return;
   
   // Toggle the appropriate lights
   toggle(currentGame, row, column);
   
   // Update the HTML table
   arrayToTable(currentGame);
   
   // Check to see if the game is won
   if (allLightsOut(currentGame)) {
      // Compute the time taken to solve the puzzle
      const now = new Date();
      const timeTaken = Math.floor((now - currentGame.startTime) / 1000);
      
      // Display message
      const infoDIV = document.getElementById("information");
      infoDIV.innerHTML = "You win! Solved in " + timeTaken + " seconds";
   }
}

// Called when the page's DOM content loads. Adds click event listeners and 
// starts a new 7x7 game.
function domLoaded() {
   // Add click event listeners for the two new game buttons
   const btn7x7 = document.getElementById("newGame7x7Button");
   btn7x7.addEventListener("click", function() {
      newGame(currentGame);
   });
   
   // Add the table's click event listener
   const table = document.getElementById("gameTable");
   table.addEventListener("click", cellClicked);
   
   // Start a new 7x7 game
   newGame(currentGame);
}
function newGame(game) {
   // Set the number of rows and columns
      game.rowCount = 7;
      game.columnCount = 7;

   // Allocate the light array, with all lights off
   const lightCount = game.rowCount * game.columnCount;
   game.lights = [];
   for (let i = 0; i < lightCount; i++)
      game.lights.push(false);
      
   // Perform a series of random toggles, which generates a game grid
   // that is guaranteed to be winnable
   while (allLightsOut(game)) {
      // Generate random lights
      for (let i = 0; i < game.lights.length * 2; i++) {
         const randRow = Math.floor(Math.random() * game.rowCount);
         const randCol = Math.floor(Math.random() * game.columnCount);
         
         // Toggle at the location
         toggle(game, randRow, randCol);
      }
   }
   
   // Get the HTML table element and clear existing content
   const gameTable = document.getElementById("gameTable");
   gameTable.innerHTML = "";
   
   // Add rows to the table
   for (let i = 0; i < game.rowCount; i++) {
      const row = gameTable.insertRow();

      // Add cells to the row
      for (let j = 0; j < game.columnCount; j++)
         row.insertCell();
   }
   
   // Populate HTML table from array
   arrayToTable(game);
   
   // Clear the information <div>
   const infoDIV = document.getElementById("information");
   infoDIV.innerHTML = "";
   
   // Store the start time
   game.startTime = new Date();
}

// Toggles the light at (row, column) and each orthogonally adjacent light
function toggle(game, row, column) {
   const locations = [
      [row, column]
   ];
   for (let location of locations) {
      row = location[0];
      column = location[1];
      if (row >= 0 && row < game.rowCount && 
         column >= 0 && column < game.columnCount) {
         // Compute array index
         for (let x=0;x<row;x++) {
            const index = x * game.columnCount + column;
            // Toggle the light
            game.lights[index] = !game.lights[index];
         }

         for (let x=row+1;x<game.rowCount;x++) {
            const index = x * game.columnCount + column;
            // Toggle the light
            game.lights[index] = !game.lights[index];
         }

         for (let x=0;x<game.rowCount;x++) {
            const index = row * game.columnCount + x;
            // Toggle the light
            game.lights[index] = !game.lights[index];
         }
      }
   }
}