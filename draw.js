import createjs from 'createjs';
 /* global createjs drawgrid */
// Adjusted URL for sprite sheet

const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;

  const spriteSheetURL = 'images/box_128.png';
  const image = new Image();
  image.src = spriteSheetURL;
  image.crossOrigin = true;

  // Create sprite sheet
  const spriteSheet = new createjs.SpriteSheet({
    images: [image],
    frames: { width: SPRITE_WIDTH, height: SPRITE_HEIGHT },
    animations: { run: [0, 3] }
  });
// Define the unit class
  export class Unit {
    constructor(row, col, health = 100, movement = 5, attack = 10, defense = 0, range = [1, 1], maxActions = 1, maxBonusActions = 1) {
      this.sprite = new createjs.Sprite(spriteSheet, 'run');
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
      this.actions = 0;
      this.maxBonusActions = maxBonusActions;
      this.bonusActions = 0;
    }
  }