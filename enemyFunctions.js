

function findattackPosition(unit,target,minRange,maxRange){

  let attackPositions = []
  let inRangePositions = []
  for(let i = 0; i < GRID_WIDTH; i++){
    for(let j = 0; j < GRID_HEIGHT; j++){
      if(Math.abs(target.col - i) + Math.abs(target.row - j) >= minRange && Math.abs(target.col - i) + Math.abs(target.row - j) <= maxRange && gridArray[j][i] === 0){
        attackPositions.push({row: j, col: i})
      }
    }
  }
  for(let i = 0; i < attackPositions.length; i++){
    if(findPath(unit.col, unit.row, attackPositions[i].col, attackPositions[i].row, unit.movement) !== null){
      inRangePositions.push(attackPositions[i])
    }
  }
  let nearestPosition = attackPositions[0];
  return inRangePositions.length > 0 ? inRangePositions[randomInt(0,inRangePositions.length-1)] : null;
}


function enemyMove(enemy, position){
  gridArray[enemy.row][enemy.col] = 0;
  enemy.col = position.col;
  enemy.row = position.row;
  enemy.scol = enemy.col;
  enemy.srow = enemy.row;
  gridArray[enemy.srow][enemy.scol] = 2;
}

function inRange(unit, target) {
  if (Math.abs(target.col - unit.col) + Math.abs(target.row - unit.row) >= unit.range[0] && Math.abs(target.col - unit.col) + Math.abs(target.row - unit.row) <= unit.range[1]) {
    return true;
  }
  return false;
}

function enemyTurn() {
  enemyUnits.forEach(enemy => {
    let target = null;
    let minDistance = Infinity;
    friendlyUnits.forEach(friendly => {
      const distance = Math.sqrt(Math.pow(friendly.col - enemy.col, 2) + Math.pow(friendly.row - enemy.row, 2));
      if (distance < minDistance) {
        target = friendly;
        minDistance = distance;
      }
    });
    if (target && inRange(enemy, target)&&enemy.actions>0) {
      attack(enemy, target);
    }
    else if (target) {
       position = findattackPosition(enemy, target, enemy.range[0], enemy.range[1]);
      if (position) {
        const path = findPath(enemy.col, enemy.row, position.col, position.row, enemy.movement);
        if (path) {
          let steps = Math.min(enemy.movement, path.length - 1);
          enemyMove(enemy, path[steps]);
          if (target && inRange(enemy, target)&&enemy.actions>0) {
            attack(enemy, target);
          }
        }
      }
      else{
        
      }
    }
  });
  endTurn();
}
