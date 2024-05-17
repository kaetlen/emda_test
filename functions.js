
  
  function attack(attacker,defender){
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
        console.log("selected actions at", selected.actions);}


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
  // Move the sprite to the clicked grid spot
  function moveToPoint(x, y, unit) {
    const [newCol, newRow] = getGridPosition(x, y);
    const distance = Math.sqrt(Math.pow(newCol - unit.scol, 2) + Math.pow(newRow - unit.srow, 2));
    const isValidMove = gridArray[newRow][newCol] === 0 && findPath(selected.scol, selected.srow, newCol, newRow, unit.movement); //!isObstacleBetween(unit.scol, unit.srow, newCol, newRow);


    if (isValidMove || newCol===selected.scol && newRow ===selected.srow) {
      unit.col = newCol;
      unit.row = newRow;
      unit.frame = ( unit.frame + 1) % spriteSheet.getNumFrames();
      
    }
  }

function checkDeath(){
friendlyUnits.forEach(unit => {
  if (unit.health <= 0) {
          //unit.sprite.visible = false;
          stage.removeChild(unit.sprite);
   
            
 
       
           
      
          gridArray[unit.row][unit.col] = 0;
          console.log(unit ,"is dead");
     friendlyUnits.splice(friendlyUnits.indexOf(unit), 1);
        }
  });

  enemyUnits.forEach(unit => {
     if (unit.health <= 0) {
          //unit.sprite.visible = false;
         // stage.removeChild(unit.sprite);
   
            

          gridArray[unit.row][unit.col] = 0;
          console.log(unit ,"is dead");
    enemyUnits.splice(enemyUnits.indexOf(unit), 1);
    
     }
  });
}
  
                     
