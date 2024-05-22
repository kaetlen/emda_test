
  
  function attack(attacker,defender){
    console.log("attacking", defender);
    attacker.actions--;
    defender.health -= randomInt(attacker.attack[0], attacker.attack[1]);
    attacker.movement -= Math.floor(Math.sqrt(Math.pow(attacker.scol - attacker.col, 2) + Math.pow(attacker.srow - attacker.row, 2)));
    gridArray[attacker.srow][attacker.scol] = 0;
    attacker.scol = attacker.col;
    attacker.srow = attacker.row;
    if (turn === 'friendly') {
      gridArray[attacker.row][attacker.col] = 1;
    }
    else {
      gridArray[attacker.row][attacker.col] = 2;
    }
    console.log("target health", defender.health);
    console.log("attacker actions at", defender.actions);}

function distanceBetween(col1, row1, col2, row2) {
return Math.sqrt(Math.pow(col1 - col2, 2) + Math.pow(row1 - row2, 2));
};

function isObstacleBetween(startCol, startRow, endCol, endRow) {
const dx = endCol - startCol;
const dy = endRow - startRow;
const distance = Math.sqrt(dx * dx + dy * dy);
const stepX = dx / distance;
const stepY = dy / distance;
let x = startCol + 0.5;
let y = startRow + 0.5;
for (let i = 0; i < distance; i++) {
if (gridArray[Math.floor(y)][Math.floor(x)] === 3) {
  return true;
}
x += stepX;
y += stepY;
}
return false;
}

function randomInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  
    if(turn === 'enemy'){
  enemyTurn();
}
//console.log(gridArray);
}
// Move the sprite to the clicked grid spot
function moveToPoint(x, y, unit) {
const [newCol, newRow] = getGridPosition(x, y);
const distance = Math.sqrt(Math.pow(newCol - unit.scol, 2) + Math.pow(newRow - unit.srow, 2));
const isValidMove = gridArray[newRow][newCol] === 0 && findPath(unit.scol, unit.srow, newCol, newRow, unit.movement); //!isObstacleBetween(unit.scol, unit.srow, newCol, newRow);


if (isValidMove || newCol===unit.scol && newRow ===unit.srow) {
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
     // stage.removeChild(unit.sprite)        

      gridArray[unit.row][unit.col] = 0;
      console.log(unit ,"is dead");
enemyUnits.splice(enemyUnits.indexOf(unit), 1);
 }
});
  
}


function isValidStep(unit, step) {
  // Check if the step is within the grid
  if (step.col < 0 || step.row < 0 || step.col >= GRID_WIDTH || step.row >= GRID_HEIGHT) {
   return false;
  }

  // Check if the step is occupied by another unit
  if (enemyUnits.some(enemy => enemy.col === step.col && enemy.row === step.row) ||
      friendlyUnits.some(friendly => friendly.col === step.col && friendly.row === step.row)) {
    return false;
  }

  // Check if the step is occupied by an obstacle
  if (grid[step.row][step.col] !== 0) {
    return false;
  }

  return true;
}

function enemyTurn() {
  enemyUnits.forEach(enemy => {
    const target = friendlyUnits.reduce((nearest, unit) => {
      const distance = Math.abs(unit.col - enemy.col) + Math.abs(unit.row - enemy.row);
      return (!nearest || distance < nearest.distance) ? { unit, distance } : nearest;
    }, null);

    if (target) {
      if (target.distance >= enemy.range[0] && target.distance <= enemy.range[1] && enemy.actions > 0) {
        attack(enemy, target.unit);
      } else if (enemy.movement > 0) {
        const path = findPath(enemy.col, enemy.row, target.unit.col, target.unit.row, enemy.movement);
        console.log(path)
        if (path && path.length > 1) {
          let steps = Math.min(enemy.movement, path.length - 1);
          for (let i = 1; i <= steps; i++) {
            if (Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) >= enemy.range[0] && Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) <= enemy.range[1] && enemy.actions > 0) {
              attack(enemy, target.unit);
              break;
            }
            const step = path[i];
            if (gridArray[step.row][step.col] === 0) {
              gridArray[enemy.row][enemy.col] = 0;
              enemy.col = step.col;
              enemy.row = step.row;
              enemy.movement--;
            } else {
              break;
            }
          }
        }
      }
    }
  });

  endTurn();
}



