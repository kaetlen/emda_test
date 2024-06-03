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


  // archer sprite sheet
  const archerSpriteSheet = new createjs.SpriteSheet({
    images: [archerImage],  // Correct image variable for the goblin sprite sheet
    frames: { width: 36, height: SPRITE_HEIGHT },
    animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
  });


// rouge sprite sheet setup
  const rougeSpriteSheetURL = 'images/rougeHero.png';
const rougeImage = new Image();
rougeImage.src = rougeSpriteSheetURL;
rougeImage.crossOrigin = true;
// rouge sprite sheet
const rougeSpriteSheet = new createjs.SpriteSheet({
  images: [rougeImage],  // Correct image variable for the goblin sprite sheet
  frames: { width: 38, height: SPRITE_HEIGHT },
  animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
});

// mage sprite sheet setup
const mageSpriteSheetURL = 'images/mageHero.png';
const mageImage = new Image();
mageImage.src = mageSpriteSheetURL;
mageImage.crossOrigin = true;
// mage sprite sheet
const mageSpriteSheet = new createjs.SpriteSheet({
  images: [mageImage],  // Correct image variable for the goblin sprite sheet
  frames: { width: 36, height: SPRITE_HEIGHT },
  animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
});

// genaral Goblin sprite sheet setup
const genGobSpriteSheetURL = 'images/genGob.png';
const genGobImage = new Image();
genGobImage.src = genGobSpriteSheetURL;
genGobImage.crossOrigin = true;
// genaral Goblin sprite sheet
const genGobSpriteSheet = new createjs.SpriteSheet({
  images: [genGobImage],  // Correct image variable for the goblin sprite sheet
  frames: { width: SPRITE_WIDTH, height: 59 },
  animations: { run: [0, 0] } // Assuming 'run' animation for goblin sprite is only frame 0
});