/* global createjs draw */
// Constants



// Initialization function
function init() {
  

  

///////////////////////////////////////// strength, dextarity, constitution, inteligence, wisdom, carisma,weponDamage defense, range = [1, 1], maxActions, maxBonusActions
friendlyUnits = [new Unit("archer",3, 0,new createjs.Sprite(archerSpriteSheet, 'run'),10, 18, 12, 8, 8, 10,[1,4], 0, [1.1, 4], 1, 1),
new Unit("knight",4, 1,new createjs.Sprite(knightSpriteSheet, 'run'),18, 10, 16, 8, 8, 8,[2,6], 3, [1, 1], 1, 1),
new Unit("rouge",0, 2,new createjs.Sprite(rougeSpriteSheet, 'run'),10, 20, 10, 8, 8, 10,[1,4], 0, [1, 1], 1, 1),
new Unit("mage",1, 1,new createjs.Sprite(mageSpriteSheet, 'run'),8, 10, 10, 18, 8, 10,[1,4], 0, [1, 1], 1, 1),
];

spawnLevel1Enemies();



 

 // Initial grid drawing
 drawGrid();
 addGridNumbers(); 
 

 drawUnits();

 // Get the grid position based on mouse coordinates

 // Add event listener for the Enter key to end the turn
 document.addEventListener("keydown", event => {
   if (event.key === "Enter" && turn === 'friendly') {
     endTurn();
    
     console.log(`${turn}'s turn`);
   }
   else if (selected && event.key === "Tab") {
    selected.movement -= Math.floor(Math.sqrt(Math.pow(selected.scol - selected.col, 2) + Math.pow(selected.srow - selected.row, 2)));
    gridArray[selected.srow][selected.scol] = 0;
    selected.scol = selected.col;
    selected.srow = selected.row;

   }
   else if (selected && event.key === "w") {
     moveToPoint(selected.col * GRID_SIZE, (selected.row - 1) * GRID_SIZE, selected);
     newLevel();
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
   

   console.log(`Grid position: ${gridPosition} ${gridArray[gridPosition[1]][gridPosition[0]]}`);

   if (selected && (gridArray[gridPosition[1]][gridPosition[0]] === 0 ||gridPosition[0]===selected.scol && gridPosition[1] ===selected.srow)) {
     moveToPoint(mouseX, mouseY, selected);
     
   }
//selected=null
   
   
   

   const units = turn === 'friendly' ? friendlyUnits : enemyUnits;
   const targets = turn === 'friendly' ? enemyUnits : friendlyUnits;
if(turn === 'friendly'){
   target = targets.find(unit => unit.col === gridPosition[0] && unit.row === gridPosition[1]);
   if (target != undefined) {
     console.log("target is ", target);
   }
   else {
     selected = units.find(unit => unit.col === gridPosition[0] && unit.row === gridPosition[1]);
   }
  
if (selected != null) {
     distance = Math.sqrt(Math.pow(gridPosition[0] - selected.col, 2) + Math.pow(gridPosition[1] - selected.row, 2));
   }
  
  
   if (selected != undefined) {
     console.log("selected is ", selected);
     if (target != undefined && distance <= selected.range[1] && distance >= selected.range[0] && selected.actions > 0 && isObstacleBetween(selected.col, selected.row, target.col, target.row) === false) {
     
       
       attack(selected,target);

     }
   }
   if (oldSelected != selected) {
    if(oldSelected != null){
    oldSelected.col = oldSelected.scol;
    oldSelected.row = oldSelected.srow;
    }
     oldSelected = selected;
   }
  }
 });


 // Update the stage on each tick
 createjs.Ticker.on("tick", () => {
  
   checkDeath();

   if (enemyUnits.length === 0) {
    
     newLevel();
   }
   // Clear the stage and redraw the grid to show updated starting positions
 
   
  
   
 

  
   
   draw();
 });
}

init(); // Call the initialization function