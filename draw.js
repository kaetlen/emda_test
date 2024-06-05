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
 
background.scaleX = canvas.width / background.image.width;
background.scaleY = canvas.height / background.image.height;
stage.addChildAt(background, 0);
  
  const GRID_COLORS = ["grey", "black", "red"];
  let activeColor = 0;
  let ySelect = 0;

  gridArray.forEach((row, j) => {
    let xSelect = 0;

    row.forEach((cell, i) => {
      const square = new createjs.Shape();
      const selectSquare= new createjs.Shape();
    
      const isUnitHere = [...friendlyUnits, ...enemyUnits].some(unit => unit.srow === j && unit.scol === i);
     const isValidMove = selected && findPath(selected.scol, selected.srow, i, j, selected.movement)&&gridArray[j][i] === 0;
     const isObstacle = selected && gridArray[j][i] !== 0 &&findPath(selected.scol, selected.srow, i, j, selected.movement);
     const isValidAttack = selected && selected.actions>0  && findPath(selected.col, selected.row, i, j, selected.range[1],selected.range[0])&&isObstacleBetween(selected.col, selected.row, i, j) === false &&gridArray[j][i] === 2;
    
     const isSelect = selected && selected.srow === j && selected.scol === i;


square.alpha = .4;
      if (isSelect) {
      selectSquare.graphics.beginFill("blue").drawRect(0, 0, GRID_SIZE, GRID_SIZE)
      selectSquare.x = xSelect;
      selectSquare.y = ySelect;
      selectSquare.alpha = 1;
      ;
    }
       else if (isValidAttack) {
      selectSquare.graphics.beginFill("red").drawRect(0, 0, GRID_SIZE, GRID_SIZE)
      selectSquare.x = xSelect;
      selectSquare.y = ySelect;
    selectSquare.alpha = 1;
      ;
    }
      else if (isUnitHere) {
      if (gridArray[j][i] === 2) {
        square.graphics.beginFill("red").drawRect(0, 0, GRID_SIZE, GRID_SIZE);
      }
      else{
      square.graphics.beginFill("blue").drawRect(0, 0, GRID_SIZE, GRID_SIZE)
      }
    }
      
    
       else if (isObstacle) {
      square.graphics.beginFill("gray").drawRect(0, 0, GRID_SIZE, GRID_SIZE);
     
    }
      
    else if (isValidMove) {
     
      square.graphics.beginFill("lightblue").drawRect(0, 0, GRID_SIZE, GRID_SIZE)
     ;
    }
   
 
   
 
    
 // else {
 //   square.graphics.beginFill(GRID_COLORS[cell === 0 ? activeColor : 2]).drawRect(0, 0, GRID_SIZE, GRID_SIZE)
  //  square.alpha = 0.1;
  // }

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
      

    
    if (isValidAttack || isSelect) {
        stage.addChild(selectSquare);
      }
      else{stage.addChild(square);}
    });

    ySelect += GRID_SIZE;
  });
}

function drawUnits(){
  // Add units to the stage and update gridArray
friendlyUnits.forEach(unit => {
  if(unit.health>0){
   unit.sprite.x = unit.col * GRID_SIZE;
    unit.sprite.y = unit.row * GRID_SIZE;
  stage.addChild(unit.sprite);
  gridArray[unit.srow][unit.scol] = 1;
 unit.sprite.gotoAndStop( unit.frame);
  }
});

enemyUnits.forEach(unit => {
   unit.sprite.x = unit.col * GRID_SIZE;
    unit.sprite.y = unit.row * GRID_SIZE;
  stage.addChild(unit.sprite);
  gridArray[unit.srow][unit.scol] = 2;
  unit.sprite.gotoAndStop( unit.frame);
});
}
//not functional
function addGridNumbers() {
  const text = new createjs.Text("0", "20px Arial", "black");
  text.textBaseline = "alphabetic";
  text.textAlign = "start";
  text.x = 0;
  text.y = 0;
  stage.addChild(text);
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

function show_stats(){
  if(selected){
    selected_stat_block.style.display= 'block';
 let text1 = document.createElement('div');
        text1.innerText =selected.name+"\n health: "+  selected.health+"\n movement: "+ selected.movement+ "\n range: "+Math.ceil(selected.range[0])+'-'+Math.floor(selected.range[1])+ "\n defence: "+ selected.defense+"\n actions: "+ selected.actions
selected_stat_block.innerHTML = '';
        selected_stat_block.appendChild(text1);

    
  }
  else{ selected_stat_block.style.display= 'none';
 selected_stat_block.innerHTML = '';
}
  
if(target){
  target_stat_block.style.display= 'block';
  let text2 = document.createElement('div');
  text2.innerText = target.health
  target_stat_block.innerHTML = '';
   target_stat_block.appendChild(text2)
}
else{
  target_stat_block.style.display= 'none';}
}

function draw() {
  stage.removeAllChildren();
  drawGrid();
  drawPath();
  drawUnits();

 show_stats()
  

  stage.update();
}