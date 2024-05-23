// Goblin sprite sheet setup
const gobSpriteSheetURL = 'images/gob.png';
const gobImage = new Image();
gobImage.src = gobSpriteSheetURL;
gobImage.crossOrigin = true;


  // Create goblin sprite sheet
  const gobSpriteSheet = new createjs.SpriteSheet({
    images: [gobImage],  // Correct image variable for the goblin sprite sheet
    frames: { width: 55, height: SPRITE_HEIGHT },
    animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
  });
  


// knight sprite sheet setup
const knightSpriteSheetURL = 'images/knightHero.png';
const knightImage = new Image();
knightImage.src = knightSpriteSheetURL;
knightImage.crossOrigin = true;


  // kight sprite sheet
  const knightSpriteSheet = new createjs.SpriteSheet({
    images: [knightImage],  // Correct image variable for the goblin sprite sheet
    frames: { width: 50, height: SPRITE_HEIGHT },
    animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
  });

// archer sprite sheet setup
const archerSpriteSheetURL = 'images/archerHero.png';
const archerImage = new Image();
archerImage.src = archerSpriteSheetURL;
archerImage.crossOrigin = true;


  // kight sprite sheet
  const archerSpriteSheet = new createjs.SpriteSheet({
    images: [archerImage],  // Correct image variable for the goblin sprite sheet
    frames: { width: 36, height: SPRITE_HEIGHT },
    animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
  });