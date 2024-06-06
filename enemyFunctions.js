

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




function enemyMove(enemy, targetPosition) {
  // Check if the target position is occupied by another enemy
  const isOccupied = enemyUnits.some(otherEnemy => 
    otherEnemy.col === targetPosition.col && otherEnemy.row === targetPosition.row 
  );
  const isOccupiedByFriendly = friendlyUnits.some(friendly =>
    friendly.col === targetPosition.col && friendly.row === targetPosition.row
  );

  const isObstacle = gridArray[targetPosition.row][targetPosition.col] !== 0;

  // Only move the enemy if the target position is not occupied
  if (!isOccupied&& !isOccupiedByFriendly && !isObstacle) {
    gridArray[enemy.row][enemy.col] = 0;
    enemy.col = targetPosition.col;
    enemy.row = targetPosition.row;
    enemy.scol = enemy.col;
  enemy.srow = enemy.row;
  }
}

function inRange(unit, target) {
  if (Math.abs(target.col - unit.col) + Math.abs(target.row - unit.row) >= unit.range[0] && Math.abs(target.col - unit.col) + Math.abs(target.row - unit.row) <= unit.range[1]) {
    return true;
  }
  return false;
}

async function enemyAction(enemy, target){

  if (target && inRange(enemy, target) && enemy.actions > 0) {
    await sleep(200); 
    attack(enemy, target);
    
  }
  else if (target) {
    let position = findattackPosition(enemy, target, enemy.range[0], enemy.range[1]);
    if (position) {
      const path = findPath(enemy.col, enemy.row, position.col, position.row, enemy.movement);
      if (path && path.length > 0) {
        let steps = Math.min(enemy.movement, path.length - 1);
        await sleep(200); 
        enemyMove(enemy, path[steps]);
        
       
        if (target && inRange(enemy, target) && enemy.actions > 0) {
           await sleep(200);
          attack(enemy, target);
          
        }
      }
    }
    else {
      // If no valid attack position is found, move towards the target
      const path = findPath(enemy.col, enemy.row, target.col, target.row, enemy.movement*4);
      if (path && path.length > 0) {
        let steps = Math.min(enemy.movement, path.length - 1);
        await sleep(200); 
        enemyMove(enemy, path[steps]);
        
      }
      
    }
  }
  else {
    // If no target is found, the enemy does nothing
  }
}

async function enemyTurn() {
  enemyUnits.forEach(async enemy => {
    let target = null;
    let minDistance = Infinity;
    let allUnitsOutOfRange = true;

    friendlyUnits.forEach(friendly => {
      if (friendly.health <= 0) {
        return;
      }
      const distance = Math.sqrt(Math.pow(friendly.col - enemy.col, 2) + Math.pow(friendly.row - enemy.row, 2));
      if (distance < minDistance) {
        target = friendly;
        minDistance = distance;
      }
      if (inRange(enemy, friendly)) {
        allUnitsOutOfRange = false;
      }
    });

    if (allUnitsOutOfRange && enemy.actions > 0) {
      enemy.movement *= 2;
      enemy.actions -= 1;
    }

    await enemyAction(enemy, target);
  });

  await sleep(500); 
  endTurn();
}


function spawnLevel1Enemies(){
  enemyUnits.push(new Unit("gobbo",11, 20,new createjs.Sprite(gobSpriteSheet, 'run'),10, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),
new Unit("gobbo",8, 17,new createjs.Sprite(gobSpriteSheet, 'run'),10, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),
new Unit("gobbo",11, 10,new createjs.Sprite(gobSpriteSheet, 'run'),10, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),

new Unit("gobbo",4, 5,new createjs.Sprite(gobSpriteSheet, 'run'),10, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),

);
}

function spawnLevel2Enemies(){

  enemyUnits.push(new Unit("gobbo",16, 16,new createjs.Sprite(gobSpriteSheet, 'run'),12, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),
new Unit("general Gob",15, 15,new createjs.Sprite(genGobSpriteSheet, 'run'),16, 14, 16, 10, 10, 10,[3,5], 2, [1, 1], 1, 1),
new Unit("gobbo",16, 14,new createjs.Sprite(gobSpriteSheet, 'run'),12, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),
new Unit("gobbo mage",14, 14,new createjs.Sprite(gobboMageSpriteSheet, 'run'),10, 12, 10, 12, 10, 10,[1,4], 0, [1.1, 4], 1, 1),
new Unit("gobbo mage",14, 16,new createjs.Sprite(gobboMageSpriteSheet, 'run'),10, 12, 10, 12, 10, 10,[1,4], 0, [1.1, 4], 1, 1),

);
}

function spawnLevel3Enemies(){

  enemyUnits.push(new Unit("Lich",16, 16,new createjs.Sprite(lichSpriteSheet, 'run'),13, 15, 20, 20, 16, 10,[5,8], 3, [1.1, 5], 2, 1),
                  new Unit("gobbo",15, 17,new createjs.Sprite(gobSpriteSheet, 'run'),12, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),
                  new Unit("gobbo",15, 15,new createjs.Sprite(gobSpriteSheet, 'run'),12, 10, 10, 10, 10, 10,[1,4], 0, [1, 1], 1, 1),
                  new Unit("gobbo mage",14, 16,new createjs.Sprite(gobboMageSpriteSheet, 'run'),10, 12, 10, 12, 10, 10,[1,4], 0, [1.1, 4], 1, 1), 
                 );
                }

const levelSpawnFunctions = [spawnLevel1Enemies, spawnLevel2Enemies, spawnLevel3Enemies];