
 // Create a 2D array for the grid
  const gridArray = Array(25).fill().map(() => Array(25).fill(0));

let turn = 'friendly';
  let selected = null;
  let target = null;


const GRID_SIZE = 64;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const GRID_WIDTH = 64
const GRIS_HIGHT = 64
 // Define the unit class
  class Unit {
    constructor(name, row, col,sprite=new createjs.Sprite(spriteSheet, 'run'), health = 10, movement = 5, attack = [3,5], defense = 0, range = [1, 1], maxActions = 1, maxBonusActions = 1) {
      this.name=name
      this.sprite = sprite
      this.row = row;
      this.col = col;
      this.srow = this.row;
      this.scol = this.col;
      this.maxMovement = movement;
      this.movement = movement;
      this.health = health;
      this.attack = attack;
      this.defense = defense;
      this.range = range;
      this.maxActions = maxActions;
      this.actions = 1;
      this.maxBonusActions = maxBonusActions;
      this.bonusActions = 1;
      this.frame=0
    }
  }

 var friendlyUnits = []
var enemyUnits = []