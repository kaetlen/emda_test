/* global createjs draw */
// Constants



// Initialization function
function init() {
  let turn = 'friendly';
  let selected = null;
  let target = null;

   gridArray[5][10] = 3;
  gridArray[5][11] = 3;
  gridArray[5][12] = 3;


  friendlyUnits = [new Unit(10, 5), new Unit(0, 0)];
 enemyUnits = [new Unit(10, 10)];

  

  



  // Create a square shape for the grid
  function drawGrid() {
    const GRID_COLORS = ["grey", "black", "red"];
    let activeColor = 0;
    let ySelect = 0;

    gridArray.forEach((row, j) => {
      let xSelect = 0;

      row.forEach((cell, i) => {
        const square = new createjs.Shape();
        const isUnitHere = [...friendlyUnits, ...enemyUnits].some(unit => unit.srow === j && unit.scol === i);
        const isValidMove = selected && findPath(selected.scol, selected.srow, i, j, selected.movement); //&& !isObstacleBetween(selected.scol, selected.srow, i, j);



        if (isUnitHere) {
          square.graphics.beginFill("blue").drawRect(0, 0, GRID_SIZE, GRID_SIZE);
        }
        else if (isValidMove) {
          square.graphics.beginFill("lightblue").drawRect(0, 0, GRID_SIZE, GRID_SIZE);
        }
        else {
          square.graphics.beginFill(GRID_COLORS[cell === 0 ? activeColor : 2]).drawRect(0, 0, GRID_SIZE, GRID_SIZE);
        }


        // Add lines to the grid
        square.graphics.setStrokeStyle(.5).beginStroke("black");
        square.graphics.moveTo(0, 0).lineTo(GRID_SIZE, 0);
        square.graphics.moveTo(GRID_SIZE, 0).lineTo(GRID_SIZE, GRID_SIZE);
        square.graphics.moveTo(GRID_SIZE, GRID_SIZE).lineTo(0, GRID_SIZE);
        square.graphics.moveTo(0, GRID_SIZE).lineTo(0, 0);


        square.x = xSelect;
        square.y = ySelect;

        xSelect += GRID_SIZE;
        activeColor = (activeColor + 1) % GRID_COLORS.length;
        if (activeColor > 1) {
          activeColor = 0;
        }
        // Add square to the stage
        stage.addChild(square);
      });

      ySelect += GRID_SIZE;
    });
  }

  // Initial grid drawing
  drawGrid();

  // Add units to the stage and update gridArray
  friendlyUnits.forEach(unit => {
    stage.addChild(unit.sprite);
    gridArray[unit.srow][unit.scol] = 1;
    unit.sprite.gotoAndStop(currentFrameIndex);
  });

  enemyUnits.forEach(unit => {
    stage.addChild(unit.sprite);
    gridArray[unit.srow][unit.scol] = 2;
    unit.sprite.gotoAndStop(currentFrameIndex);
  });

  // Get the grid position based on mouse coordinates
  function getGridPosition(x, y) {
    return [Math.floor(x / GRID_SIZE), Math.floor(y / GRID_SIZE)];
  }

  // Move the sprite to the clicked grid spot
  function moveToPoint(x, y, unit) {
    const [newCol, newRow] = getGridPosition(x, y);
    const distance = Math.sqrt(Math.pow(newCol - unit.scol, 2) + Math.pow(newRow - unit.srow, 2));
    const isValidMove = gridArray[newRow][newCol] === 0 && findPath(selected.scol, selected.srow, newCol, newRow, unit.movement); //!isObstacleBetween(unit.scol, unit.srow, newCol, newRow);


    if (isValidMove) {
      unit.col = newCol;
      unit.row = newRow;
      currentFrameIndex = (currentFrameIndex + 1) % spriteSheet.getNumFrames();
      unit.sprite.gotoAndStop(currentFrameIndex);
    }
  }

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

    if (selected && gridArray[gridPosition[1]][gridPosition[0]] === 0) {
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
      if (target != undefined && distance <= selected.range[1] && distance >= selected.range[0] && selected.actions >= 0) {
        console.log("attacking", target);
        selected.actions--;
        target.health -= selected.attack;
        selected.movement -= Math.floor(Math.sqrt(Math.pow(selected.scol - selected.col, 2) + Math.pow(selected.srow - selected.row, 2)));
        gridArray[selected.srow][selected.scol] = 0;
        selected.scol = selected.col;
        selected.srow = selected.row;
        if (turn === 'friendly') {
          gridArray[selected.row][selected.col] = 1;
        }
        else {
          gridArray[selected.row][selected.col] = 2;
        }
        console.log("target health", target.health);
        console.log("selected actions at", selected.actions);


        if (target.health <= 0) {
          target.sprite.visible = false;
          stage.removeChild(target.sprite);
          if (turn === 'friendly') {
            enemyUnits.splice(enemyUnits.indexOf(target), 1);
          }
          else {
            friendlyUnits.splice(friendlyUnits.indexOf(target), 1);
          }
          gridArray[target.row][target.col] = 0;
          console.log("target dead");
        }
      }
    }
  });


  // Function to end the turn
  function endTurn() {
    selected = undefined
    // Update the player's actual position to the intended position at the end of the turn
    friendlyUnits.forEach(unit => {
      gridArray[unit.srow][unit.scol] = 0;
      unit.scol = unit.col;
      unit.srow = unit.row;
      gridArray[unit.srow][unit.scol] = 1;
      unit.actions = unit.maxActions;
      unit.movement = unit.maxMovement;
      unit.bonusActions = unit.maxBonusActions;
    });

    enemyUnits.forEach(unit => {
      gridArray[unit.srow][unit.scol] = 0;
      unit.scol = unit.col;
      unit.srow = unit.row;
      gridArray[unit.srow][unit.scol] = 2;
      unit.actions = unit.maxActions;
      unit.movement = unit.maxMovement;
      unit.bonusActions = unit.maxBonusActions;
    });



    // Switch turns between friendly and enemy
    turn = turn === 'friendly' ? 'enemy' : 'friendly';
    console.log(gridArray);
  }

  // Update the stage on each tick
  createjs.Ticker.on("tick", () => {
    stage.update();

    friendlyUnits.forEach(unit => {
      unit.sprite.x = unit.col * GRID_SIZE;
      unit.sprite.y = unit.row * GRID_SIZE;
    });

    enemyUnits.forEach(unit => {
      unit.sprite.x = unit.col * GRID_SIZE;
      unit.sprite.y = unit.row * GRID_SIZE;
    });

    // Clear the stage and redraw the grid to show updated starting positions
    stage.removeAllChildren();
    drawGrid();

    // Re-add players to the stage
    friendlyUnits.forEach(unit => stage.addChild(unit.sprite));
    enemyUnits.forEach(unit => stage.addChild(unit.sprite));

  });
}

init(); // Call the initialization function