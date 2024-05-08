/* global keyMonkey, createjs,*/




// Initialization function
function init() {
  var grid_array = [];

for (var row = 0; row < 25; row++) {
    grid_array[row] = [];
    for (var col = 0; col < 25; col++) {
        grid_array[row][col] = 0;
    }
}
  grid_array[5][10]=1
  
  console.log(grid_array)
  
  
  const grid_size=64
  
  
  
  
    var canvas = document.getElementById('myCanvas');
    var stage = new createjs.Stage(canvas);

    // Constants for sprite and grid dimensions
    const SPRITE_WIDTH = 64;
    const SPRITE_HEIGHT = 64;
    const BORDER_WIDTH = 0;
    const SPACING_WIDTH = 0;
    const GRID_WIDTH = 64;
    const GRID_HEIGHT = 64;

    // Adjusted URL for sprite sheet
    var spriteSheetURL = 'images/box_128.png';
    var image = new Image();
    image.src = spriteSheetURL;
    image.crossOrigin = true;

    var row = 0;
    var col = 0;

    var move_x = 0;
    var move_y = 0;
  

var Yselect=0
var Xselect=0
var grid_color=["grey","black","red"]
var active_color=0
            // Create a square shape
  for (var j=0;j<grid_array[row].length;j++){
    var Xselect=0
    
     
  for (var i=0;i<grid_array[col].length;i++){
           var square = new createjs.Shape();
    
    
    if (grid_array[j][i]==0){
            square.graphics.beginFill(grid_color[active_color]).drawRect(0, 0, grid_size, grid_size);
    }
    else{square.graphics.beginFill(grid_color[2]).drawRect(0, 0, grid_size, grid_size);
        console.log(j+","+i+" not empty")}
    
    
    square.x = Xselect;
    square.y = Yselect;
    
    Xselect+=grid_size
    active_color++
    if (active_color>1){
      active_color=0
    }
            // Add square to the stage
            stage.addChild(square);
  }
    Yselect+=grid_size
  }
  
  
  
    // Create sprite sheet
    var spriteSheet = new createjs.SpriteSheet({
        images: [image],
    
      
      
      
      frames: {
            width: SPRITE_WIDTH,
            height: SPRITE_HEIGHT,
            //count: 4 // Total frames in the sprite sheet
        },
        animations: {
            run: [0,3]
        }
    });

    var currentFrameIndex = 0;
    var sprite = new createjs.Sprite(spriteSheet,'run');
  class player{
    constructor(sprite,row,col){
      this.sprite=new createjs.Sprite(spriteSheet,'run');
      this.row=row
      this.col=col
      this.x=this.row*grid_size
      this.y=this.col*grid_size
    }
  }
 var playerObj = new player(sprite, 0, 0);
    playerObj.sprite.gotoAndStop(currentFrameIndex)
    stage.addChild(playerObj.sprite);
  

    // Move sprite to the clicked grid spot
function moveToPoint(x, y) {
    // Calculate the grid position based on the mouse coordinates
    var newCol = Math.floor(x / grid_size);
    var newRow = Math.floor(y / grid_size);

    // Check if the new position is adjacent to the current position
  console.log("distance: "+(Math.sqrt(Math.pow(newCol - playerObj.col, 2) + Math.pow(newRow - playerObj.row, 2)))+"/"+4)
    if (Math.sqrt(Math.pow(newCol - playerObj.col, 2) + Math.pow(newRow - playerObj.row, 2)) <4) {
        // Move the sprite to the center of the clicked grid spot
        move_x = newCol * grid_size;
        move_y = newRow * grid_size;

      
        // Update the sprite position
        playerObj.sprite.x = move_x;
        playerObj.sprite.y = move_y;

        // Update the player's position
        playerObj.col = newCol;
        playerObj.row = newRow;
      
      

        // Change sprite frame index
        currentFrameIndex = (currentFrameIndex + 1) % spriteSheet.getNumFrames();
        playerObj.sprite.gotoAndStop(currentFrameIndex);
    }
}
  
  

    // Add click event listener to the canvas
    canvas.addEventListener("click", function(event) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        moveToPoint(mouseX, mouseY);
    });

    // Update the stage on each tick
    createjs.Ticker.on("tick", function() {
      
        stage.update();

    });
}

init(); // Call the initialization function
