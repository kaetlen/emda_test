/* global keyMonkey, createjs */

// Initialization function
function init() {
  // Initialize grid and canvas
  const gridSize = 64;
  const GRID_WIDTH = 25;
  const GRID_HEIGHT = 25;
  const SPRITE_WIDTH = 64;
  const SPRITE_HEIGHT = 64;
  const BORDER_WIDTH = 0;
  const spriteSheetURL = 'images/box_128.png';
  const gridArray = [];

  for (let row = 0; row < GRID_HEIGHT; row++) {
    gridArray[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      gridArray[row][col] = 0; // Initialize grid cells to empty
    }
  }
  gridArray[5][10] = 1; // Example: Set a grid cell as occupied

  console.log(gridArray);

  const canvas = document.getElementById('myCanvas');
  const stage = new createjs.Stage(canvas);

  const playerUnits = [];
  const enemyUnits = [];

  const image = new Image();
  image.src = spriteSheetURL;
  image.crossOrigin = true;

  let moveX = 0;
  let moveY = 0;
  let selectedUnit = null;
  let currentPlayerTurn = "Player";

  // Create sprite sheet
  const spriteSheet = new createjs.SpriteSheet({
    images: [image],
    frames: {
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
      regX: BORDER_WIDTH,
      regY: BORDER_WIDTH,
    },
  });

  // Create grid
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tile = new createjs.Sprite(spriteSheet);
      tile.gotoAndStop(0); // Select frame from sprite sheet
      tile.x = col * SPRITE_WIDTH;
      tile.y = row * SPRITE_HEIGHT;
      tile.width = SPRITE_WIDTH;
      tile.height = SPRITE_HEIGHT;
      tile.addEventListener('mouseover', function(event) {
        tile.gotoAndStop(1); // Change frame when mouse is over
      });
      tile.addEventListener('mouseout', function(event) {
        tile.gotoAndStop(0); // Revert back to original frame when mouse leaves
      });
      tile.addEventListener('click', function(event) {
        console.log('Clicked on tile:', event.target);
      });
      stage.addChild(tile);
    }
  }

  // Create units
  const playerUnit1 = createUnit(2, 2, "Player", 2); // Example: maxDistance of 2
  const playerUnit2 = createUnit(4, 4, "Player", 3); // Example: maxDistance of 3
  const enemyUnit1 = createUnit(8, 2, "Enemy", 2); // Example: maxDistance of 2
  const enemyUnit2 = createUnit(6, 4, "Enemy", 3); // Example: maxDistance of 3

  stage.update();

  // Keyboard controls
  keyMonkey.attach({
    'up': () => moveUnit(selectedUnit, 0, -1),
    'down': () => moveUnit(selectedUnit, 0, 1),
    'left': () => moveUnit(selectedUnit, -1, 0),
    'right': () => moveUnit(selectedUnit, 1, 0),
    'space': endTurn,
  });

  // Update function
  createjs.Ticker.addEventListener('tick', () => stage.update());

  function createUnit(x, y, type, maxDistance) {
    const unit = new createjs.Sprite(spriteSheet);
    unit.gotoAndStop(type === "Player" ? 1 : 2); // Adjust frame index for player and enemy units
    unit.x = x * SPRITE_WIDTH;
    unit.y = y * SPRITE_HEIGHT;
    unit.width = SPRITE_WIDTH;
    unit.height = SPRITE_HEIGHT;
    unit.type = type;
    unit.maxDistance = maxDistance; // Set max distance for the unit

    unit.addEventListener("click", function(event) {
      console.log("Selected unit: ", this);
      selectedUnit = this;
    });

    if (type === "Player") {
      playerUnits.push(unit);
    } else {
      enemyUnits.push(unit);
    }

    stage.addChild(unit);
    return unit;
  }

  function moveUnit(unit, offsetX, offsetY) {
    if (!unit || currentPlayerTurn !== unit.type) return; // Check if it's the unit's turn
    const newX = unit.x / SPRITE_WIDTH + offsetX;
    const newY = unit.y / SPRITE_HEIGHT + offsetY;

    // Check if the movement is within the unit's max distance and if the cell is empty
    if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT &&
        gridArray[newY][newX] === 0 &&
        Math.abs(newX - (unit.x / SPRITE_WIDTH)) + Math.abs(newY - (unit.y / SPRITE_HEIGHT)) <= unit.maxDistance) {
      unit.x += offsetX * SPRITE_WIDTH;
      unit.y += offsetY * SPRITE_HEIGHT;
    }
  }

  function endTurn() {
    // Switch turns between players and enemies
    currentPlayerTurn = currentPlayerTurn === "Player" ? "Enemy" : "Player";
    console.log(currentPlayerTurn + "'s turn.");
  }
}

// Initialize the game
init();