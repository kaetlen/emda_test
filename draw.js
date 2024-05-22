/* global createjs */



  const canvas = document.getElementById('myCanvas');
  const stage = new createjs.Stage(canvas);

  // Adjusted URL for sprite sheet
  const spriteSheetURL = 'images/box_128.png';
  const image = new Image();
  image.src = spriteSheetURL;
  image.crossOrigin = true;

  // Create sprite sheet
  const spriteSheet = new createjs.SpriteSheet({
    images: [image],
    frames: { width: SPRITE_WIDTH, height: SPRITE_HEIGHT },
    animations: { run: [0, 3] }
  });

  let currentFrameIndex = 0;



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
       const isValidMove = selected && findPath(selected.scol, selected.srow, i, j, selected.movement)&&gridArray[j][i] === 0;



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

 function drawUnits(){
    // Add units to the stage and update gridArray
  friendlyUnits.forEach(unit => {
     unit.sprite.x = unit.col * GRID_SIZE;
      unit.sprite.y = unit.row * GRID_SIZE;
    stage.addChild(unit.sprite);
    gridArray[unit.srow][unit.scol] = 1;
   unit.sprite.gotoAndStop( unit.frame);
  });

  enemyUnits.forEach(unit => {
     unit.sprite.x = unit.col * GRID_SIZE;
      unit.sprite.y = unit.row * GRID_SIZE;
    stage.addChild(unit.sprite);
    gridArray[unit.srow][unit.scol] = 2;
    unit.sprite.gotoAndStop( unit.frame);
  });
  }


  function drawPath() {
  if (selected) {
    const path = findPath(selected.scol, selected.srow, selected.col, selected.row, selected.movement);
    const line = new createjs.Shape();
    line.graphics.setStrokeStyle(2).beginStroke("green");
    line.graphics.moveTo(selected.scol * GRID_SIZE + GRID_SIZE / 2, selected.srow * GRID_SIZE + GRID_SIZE / 2);
    path.forEach((step) => {
      line.graphics.lineTo(step.col * GRID_SIZE + GRID_SIZE / 2, step.row * GRID_SIZE + GRID_SIZE / 2);
    });
    stage.addChild(line);
  }
}

  function draw() {
    stage.removeAllChildren();
    drawGrid();
    drawPath();
    drawUnits();
    
    stage.update();
  }