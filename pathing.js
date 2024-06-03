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

function getNeighbors(node) {
  const neighbors = [];
  for (let col = node.col - 1; col <= node.col + 1; col++) {
    for (let row = node.row - 1; row <= node.row + 1; row++) {
      if (col === node.col && row === node.row) {
        continue;
      }
      if (col < 0 || col >= gridArray[0].length || row < 0 || row >= gridArray.length) {
        continue;
      }
      if (isObstacleBetween(node.col, node.row, col, row)) {
        continue;
      }
      neighbors.push({ col, row });
    }
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


