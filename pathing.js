class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }

  size() {
    return this._heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this._heap[0];
  }

  push(value) {
    this._heap.push(value);
    this._siftUp();
  }

  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }

  _parent(i) {
    return ((i + 1) >>> 1) - 1;
  }

  _left(i) {
    return (i << 1) + 1;
  }

  _right(i) {
    return (i + 1) << 1;
  }

  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _siftUp() {
    let node = this.size() - 1;
    while (node > 0 && this._greater(node, this._parent(node))) {
      this._swap(node, this._parent(node));
      node = this._parent(node);
    }
  }

  _siftDown() {
    let node = 0;
    while (
      (this._left(node) < this.size() && this._greater(this._left(node), node)) ||
      (this._right(node) < this.size() && this._greater(this._right(node), node))
    ) {
      let maxChild = (this._right(node) < this.size() && this._greater(this._right(node), this._left(node))) ? this._right(node) : this._left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

function findPath(startCol, startRow, endCol, endRow, maxDistance, minDistance=0) {
    // Check if the destination is reachable
    const destination = { col: endCol, row: endRow };
    const destinationNeighbors = getNeighbors(destination);
    if (destinationNeighbors.length === 0) {
      // The destination is surrounded by obstacles, return null or an appropriate value
      return null;
    }
    
  const openList = new PriorityQueue((a, b) => a.f < b.f);
  const closedList = new Set();
  const cameFrom = Array(gridArray.length).fill().map(() => Array(gridArray[0].length).fill(null));

  let closestNode = null;
  let minH = Infinity;

  openList.push({ col: startCol, row: startRow, g: 0, h: 0, f: 0 });

  while (!openList.isEmpty()) {
    let currentNode = openList.pop();
    if (currentNode.h < minH) {
      closestNode = currentNode;
      minH = currentNode.h;
    }

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

  if (closestNode) {
    const path = [];
    let current = closestNode;
    while (current) {
      path.unshift({ col: current.col, row: current.row });
      current = cameFrom[current.row][current.col];
    }
    return path;
  }

  return null;
}

function findPathMaxDistance(startX, startY, endX, endY, maxDistance) {
  // Initialize the queue with the start position and distance 0
  let queue = [{x: startX, y: startY, dist: 0}];

  // Initialize a 2D array to keep track of visited cells
  let visited = Array.from({length: gridArray.length}, () => Array(gridArray[0].length).fill(false));
  visited[startY][startX] = true;

  // Define the possible directions to move on the grid
  let directions = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

  while (queue.length > 0) {
    let current = queue.shift();

    // If we've reached the end position, return the distance
    if (current.x === endX && current.y === endY) {
      return current.dist;
    }

    // If we've reached the maximum distance, stop searching
    if (current.dist === maxDistance) {
      continue;
    }

    // Explore the neighbors
    for (let dir of directions) {
      let newX = current.x + dir.x;
      let newY = current.y + dir.y;

      // Check if the new position is within the grid and not visited
      if (newX >= 0 && newX < gridArray[0].length && newY >= 0 && newY < gridArray.length && !visited[newY][newX]) {
        // Mark the position as visited and add it to the queue with the updated distance
        visited[newY][newX] = true;
        queue.push({x: newX, y: newY, dist: current.dist + 1});
      }
    }
  }

  // If we've exhausted all possible paths without finding the end, return null
  return null;
}
function getNeighbors(node) {
  const neighbors = [];
  const directions = [
    { col: -1, row: 0 }, // left
    { col: 1, row: 0 }, // right
    { col: 0, row: -1 }, // up
    { col: 0, row: 1 }, // down
    { col: -1, row: -1 }, // up-left
    { col: 1, row: -1 }, // up-right
    { col: -1, row: 1 }, // down-left
    { col: 1, row: 1 } // down-right
  ];

  for (const direction of directions) {
    const col = node.col + direction.col;
    const row = node.row + direction.row;

    if (col < 0 || col >= gridArray[0].length || row < 0 || row >= gridArray.length) {
      continue;
    }

    // Check if the neighbor itself is an obstacle
    if (gridArray[row][col] !== 0) {
      continue;
    }

    // Check if moving diagonally would result in moving through an obstacle
    if (direction.col !== 0 && direction.row !== 0) {
      if (gridArray[node.row + direction.row][node.col] !== 0 || gridArray[node.row][node.col + direction.col] !== 0) {
        continue;
      }
    }

    neighbors.push({ col, row });
  }

  return neighbors;
}

function isObstacleBetween(startCol, startRow, endCol, endRow) {
  const dx = Math.abs(endCol - startCol);
  const dy = Math.abs(endRow - startRow);
  const sx = startCol < endCol ? 1 : -1;
  const sy = startRow < endRow ? 1 : -1;
  let err = dx - dy;
  while (startCol !== endCol || startRow !== endRow) {
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      startCol += sx;
    }
    if (e2 < dx) {
      err += dx;
      startRow += sy;
    }
    if (gridArray[startRow][startCol] !== 0) {
      return true;
    }
  }
  return false;
}

function getGridPosition(x, y) {
  return [Math.floor(x / GRID_SIZE), Math.floor(y / GRID_SIZE)];
}


