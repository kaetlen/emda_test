

function findattackPosition(unit,target,minRange,maxRange){

  let attackPositions = []
  let inRangePositions = []
  for(let i = 0; i < GRID_WIDTH; i++){
    for(let j = 0; j < GRID_HEIGHT; j++){
      if(Math.abs(target.col - i) + Math.abs(target.row - j) >= minRange && Math.abs(target.col - i) + Math.abs(target.row - j) <= maxRange){
        attackPositions.push({row: j, col: i})
      }
    }
  }
  for(let i = 0; i < attackPositions.length; i++){
    if(findPath(unit.col, unit.row, attackPositions[i].col, attackPositions[i].row, unit.movement) !== null){
      inRangePositions.push(attackPositions[i])
    }
  }
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
    }
  });
  endTurn();
}
//////////////////////////////////////////////////////////////////////////
function findPath(startCol, startRow, endCol, endRow, maxDistance, minDistance=0) {
  const openList = new PriorityQueue((a, b) => a.f < b.f);
  const closedList = new Set();
  const cameFrom = Array(gridArray.length).fill().map(() => Array(gridArray[0].length).fill(null));

  openList.push({ col: startCol, row: startRow, g: 0, h: 0, f: 0 });

  while (!openList.isEmpty()) {
    let currentNode = openList.pop();
    if (currentNode.col === endCol && currentNode.row === endRow) {
      const path = [];
      let current = currentNode;
      while (current) {
        path.unshift({ col: current.col, row: current.row });
        current = cameFrom[current.row][current.col];
      }
      let distance = 0;
      for (let i = 1; i < path.length; i++) {
        const dx = path[i].col - path[i - 1].col;
        const dy = path[i].row - path[i - 1].row;
        distance += (dx !== 0 && dy !== 0) ? Math.sqrt(2) : 1;
      }
      if (distance <= maxDistance && distance >= minDistance) {
        return path;
      } else {
        return null;
      }
    }

    closedList.add(`${currentNode.col},${currentNode.row}`);

    const neighbors = getNeighbors(currentNode, startCol, startRow, maxDistance);

    for (const neighbor of neighbors) {
      const isDiagonal = Math.abs(neighbor.col - currentNode.col) === 1 && Math.abs(neighbor.row - currentNode.row) === 1;
      const g = currentNode.g + ((isDiagonal) ? Math.sqrt(2) : 1);
      const h = Math.sqrt(Math.pow(neighbor.col - endCol, 2) + Math.pow(neighbor.row - endRow, 2)); // Euclidean distance
      const f = g + h;

      if (closedList.has(`${neighbor.col},${neighbor.row}`)) {
        continue;
      }

      const existingNode = openList._heap.find(node => node.col === neighbor.col && node.row === neighbor.row);
      if (existingNode) {
        if (g < existingNode.g) {
          existingNode.g = g;
          existingNode.f = f;
          cameFrom[neighbor.row][neighbor.col] = currentNode;
        }
      } else {
        openList.push({ col: neighbor.col, row: neighbor.row, g, h, f });
        cameFrom[neighbor.row][neighbor.col] = currentNode;
      }
    }
  }

  // If no path found within maxDistance, return the farthest reachable point
  let maxReachableNode = null;
  let maxReachableDistance = -Infinity;

  for (const node of openList._heap) {
    if (node.g > maxReachableDistance) {
      maxReachableNode = node;
      maxReachableDistance = node.g;
    }
  }

  if (maxReachableNode) {
    const path = [];
    let current = maxReachableNode;
    while (current) {
      path.unshift({ col: current.col, row: current.row });
      current = cameFrom[current.row][current.col];
    }
    return path;
  }

  return null;
}

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
  console.log("attacker actions at", attacker.actions);}

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