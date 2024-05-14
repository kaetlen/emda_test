/* global keyMonkey, createjs */

// Initialization function
function init() {
  var gridArray = [];

  for (var row = 0; row < 25; row++) {
    gridArray[row] = [];
    for (var col = 0; col < 25; col++) {
      gridArray[row][col] = 0;
    }
  }
  gridArray[5][10] = 1;

  console.log(gridArray);

  const gridSize = 64;

  var canvas = document.getElementById('myCanvas');
  var stage = new createjs.Stage(canvas);

  // Constants for sprite and grid dimensions
  const SPRITE_WIDTH = 64;
  const SPRITE_HEIGHT = 64;
  const BORDER_WIDTH = 0;
  const SPACING_WIDTH = 0;
  const GRID_WIDTH = 64;
  const GRID_HEIGHT = 64;

  // Adjusted URL for sprite sheet
  var spriteSheetURL = 'images/box_128.png';
  var image = new Image();
  image.src = spriteSheetURL;
  image.crossOrigin = true;

  var moveX = 0;
  var moveY = 0;

  var ySelect = 0;
  var xSelect = 0;
  var gridColors = ["grey", "black", "red"];
  var activeColor = 0;

  
  // Create sprite sheet
  var spriteSheet = new createjs.SpriteSheet({
    images: [image],
    frames: {
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
    },
    animations: {
      run: [0, 3]
    }
  });

  var currentFrameIndex = 0;
  var sprite = new createjs.Sprite(spriteSheet, 'run');

  class Player {
    constructor(sprite, row, col) {
      this.sprite = new createjs.Sprite(spriteSheet, 'run');
      this.row = row;
      this.col = col;
      this.srow = this.row;
      this.scol = this.col;
      this.selected = false;
      this.max_move = 4;
      this.movement = 4;
    }
  }

  var playerObj = new Player(sprite, 0, 0);
  playerObj.sprite.gotoAndStop(currentFrameIndex);
  

  var playerObj2 = new Player(spriteSheet, 5, 5);
  playerObj2.sprite.gotoAndStop(currentFrameIndex);
 
  
  
  
  // Create a square shape
  function drawGrid() {
    for (var j = 0; j < gridArray.length; j++) {
      xSelect = 0;

      for (var i = 0; i < gridArray[j].length; i++) {
        var square = new createjs.Shape();

        // Check for starting position
        if ((playerObj.srow == j && playerObj.scol == i) || (playerObj2.srow == j && playerObj2.scol == i)) {
          square.graphics.beginFill("blue").drawRect(0, 0, gridSize, gridSize);
        } else if (gridArray[j][i] == 0) {
          square.graphics.beginFill(gridColors[activeColor]).drawRect(0, 0, gridSize, gridSize);
        } else {
          square.graphics.beginFill(gridColors[2]).drawRect(0, 0, gridSize, gridSize);
          console.log(j + "," + i + " not empty");
        }

        square.x = xSelect;
        square.y = ySelect;

        xSelect += gridSize;
        activeColor = (activeColor + 1) % gridColors.length;
        if (activeColor == 2) {
          activeColor = 0;
        }
        // Add square to the stage
        stage.addChild(square);
      }
      ySelect += gridSize;
    }
  }

  // Initial grid drawing
  drawGrid();
  stage.addChild(playerObj.sprite);
 stage.addChild(playerObj2.sprite);

  function getGridPosition(x, y) {
    var col = Math.floor(x / gridSize);
    var row = Math.floor(y / gridSize);
    return [col, row];
  }

  // Move sprite to the clicked grid spot
  function moveToPoint(x, y, obj) {
    // Calculate the grid position based on the mouse coordinates
    var newPos = getGridPosition(x, y);
    var newCol = newPos[0];
    var newRow = newPos[1];

    // Check if the new position is adjacent to the current position
    console.log("distance: " + (Math.sqrt(Math.pow(newCol - obj.scol, 2) + Math.pow(newRow - obj.srow, 2))) + "/" + obj.movement);
    if (Math.sqrt(Math.pow(newCol - obj.scol, 2) + Math.pow(newRow - obj.srow, 2)) <= obj.movement) {
     

      // Update the player's position
      obj.col = newCol;
      obj.row = newRow;

      // Change sprite frame index
      currentFrameIndex = (currentFrameIndex + 1) % spriteSheet.getNumFrames();
      obj.sprite.gotoAndStop(currentFrameIndex);
    }
  }

  // Add click event listener to the canvas
  canvas.addEventListener("click", function (event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    var gridPosition = getGridPosition(mouseX, mouseY);
    console.log('Grid position: ' + gridPosition);
    console.log('Player position: ' + playerObj.col, playerObj.row);
    console.log('Player 2 position: ' + playerObj2.col, playerObj2.row);

    if (playerObj.selected == true) {
      moveToPoint(mouseX, mouseY, playerObj);
    }
    if (playerObj2.selected == true) {
      moveToPoint(mouseX, mouseY, playerObj2);
    }

    document.addEventListener("mouseup", function (event) {
      if (playerObj.col == gridPosition[0] && playerObj.row == gridPosition[1]) {
        playerObj.selected = true;
      } else {
        playerObj.selected = false;
      }

      if (playerObj2.col == gridPosition[0] && playerObj2.row == gridPosition[1]) {
        playerObj2.selected = true;
      } else {
        playerObj2.selected = false;
      }

    });
  });

  function end_turn() {
    // Update the player's actual position to the intended position at the end of the turn
    playerObj.scol = playerObj.col;
    playerObj.srow = playerObj.row;
    playerObj2.scol = playerObj2.col;
    playerObj2.srow = playerObj2.row;

    // Reset movements for the next turn
    playerObj.movement = playerObj.max_move;
    playerObj2.movement = playerObj2.max_move;

    // Clear the stage and redraw the grid to show updated starting positions
    stage.removeAllChildren();
    drawGrid();

    // Re-add players to the stage
    stage.addChild(playerObj.sprite);
    stage.addChild(playerObj2.sprite);
  }

  // Update the stage on each tick
  createjs.Ticker.on("tick", function () {
    stage.update();
    playerObj.sprite.x = (playerObj.col * gridSize);
    playerObj.sprite.y = (playerObj.row * gridSize);

    playerObj2.sprite.x = (playerObj2.col * gridSize);
    playerObj2.sprite.y = (playerObj2.row * gridSize);
  });
}

init(); // Call the initialization function
