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
        const path = findPath(enemy.col, enemy.row, target.unit.col, target.unit.row, enemy.movement*3);
        console.log(path)
        if (path) {
          let steps = Math.min(enemy.movement, path.length - 1);
          for (let i = 1; i <Math.min(enemy.movement, path.length); i++) {
            if (Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) >= enemy.range[0] && Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) <= enemy.range[1] && enemy.actions > 0) {
              attack(enemy, target.unit);
              break;
            }
            const step = path[i];
            if (gridArray[step.row][step.col] === 0) {
              gridArray[enemy.row][enemy.col] = 0;
              enemy.col = step.col;
              enemy.row = step.row;
              enemy.movement-=.5;
              enemy.scol = enemy.col;
              enemy.srow = enemy.row;
              gridArray[enemy.srow][enemy.scol] = 2;
            } else {
              if (Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) >= enemy.range[0] && Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) <= enemy.range[1] && enemy.actions > 0) {
              attack(enemy, target.unit);
              break;
            }
              break;
            }
          }
          if (Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) >= enemy.range[0] && Math.abs(target.unit.col - enemy.col) + Math.abs(target.unit.row - enemy.row) <= enemy.range[1] && enemy.actions > 0) {
              attack(enemy, target.unit);
             
            }
        }
      }
    }
  });

  endTurn();
}