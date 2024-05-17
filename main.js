/* global createjs draw */
// Constants



// Initialization function
function init() {
  

   gridArray[5][10] = 3;
  gridArray[5][11] = 3;
  gridArray[5][12] = 3;


  friendlyUnits = [new Unit(10, 5), new Unit(0, 0)];
 enemyUnits = [new Unit(10, 10)];

  

  // Initial grid drawing
  drawGrid();

  
 
  drawUnits();

  // Get the grid position based on mouse coordinates
 
  // Add event listener for the Enter key to end the turn
  document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      endTurn();
      console.log(`${turn}'s turn`);
    }
    else if (selected && event.key === "w") {
      moveToPoint(selected.col * GRID_SIZE, (selected.row - 1) * GRID_SIZE, selected);
    }
    else if (selected && event.key === "a") {
      moveToPoint((selected.col - 1) * GRID_SIZE, selected.row * GRID_SIZE, selected);
    }
    else if (selected && event.key === "s") {
      moveToPoint(selected.col * GRID_SIZE, (selected.row + 1) * GRID_SIZE, selected);
    }
    else if (selected && event.key === "d") {
      moveToPoint((selected.col + 1) * GRID_SIZE, selected.row * GRID_SIZE, selected);
    }
  });

  // Add click event listener to the canvas
  document.addEventListener("mouseup", () => {

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const gridPosition = getGridPosition(mouseX, mouseY);
    var distance = 0
    if (selected != null) {
      distance = Math.sqrt(Math.pow(gridPosition[0] - selected.col, 2) + Math.pow(gridPosition[1] - selected.row, 2));
    }

    console.log(`Grid position: ${gridPosition} ${gridArray[gridPosition[1]][gridPosition[0]]}`);

    if (selected && (gridArray[gridPosition[1]][gridPosition[0]] === 0 ||gridPosition[0]===selected.scol && gridPosition[1] ===selected.srow)) {
      moveToPoint(mouseX, mouseY, selected);
    }


    const units = turn === 'friendly' ? friendlyUnits : enemyUnits;
    const targets = turn === 'friendly' ? enemyUnits : friendlyUnits;

    target = targets.find(unit => unit.col === gridPosition[0] && unit.row === gridPosition[1]);
    if (target != undefined) {
      console.log("target is ", target);
    }
    else {
      selected = units.find(unit => unit.col === gridPosition[0] && unit.row === gridPosition[1]);
    }

    if (selected != undefined) {
      console.log("selected is ", selected);
      if (target != undefined && distance <= selected.range[1] && distance >= selected.range[0] && selected.actions > 0) {
      
        
        attack(selected,target)


//         if (target.health <= 0) {
//           target.sprite.visible = false;
//           stage.removeChild(target.sprite);
//           if (turn === 'friendly') {
//             enemyUnits.splice(enemyUnits.indexOf(target), 1);
//           }
//           else {
//             friendlyUnits.splice(friendlyUnits.indexOf(target), 1);
//           }
//           gridArray[target.row][target.col] = 0;
//           console.log("target dead");
//         }
      }
    }
  });



  // Update the stage on each tick
  createjs.Ticker.on("tick", () => {
    checkDeath();

    draw();
    // Clear the stage and redraw the grid to show updated starting positions
  
   
    
  

   
    

  });
}

init(); // Call the initialization function