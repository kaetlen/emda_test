/* global createjs draw */
// Constants



// Initialization function
function init() {
  text_box.style.display = 'flex'
  text_box.style.justifyContent = 'center'; // centers text horizontally
  text_box.style.alignItems = 'center'; // centers text vertically

  text_box.innerHTML = diolog[currentLine];
  text_box.style.fontSize = '20px';
 

  levelSong.loop=true
  levelSong.play();

  

  ///////////////////////////////////////// strength, dextarity, constitution, inteligence, wisdom, carisma,weponDamage defense, range = [1, 1], maxActions, maxBonusActions
  friendlyUnits = [new Unit("archer",3, 0,new createjs.Sprite(archerSpriteSheet, 'run'),10, 17, 11, 8, 8, 10,[1,4], 0, [1.1, 5], 1, 1),
  new Unit("knight",4, 1,new createjs.Sprite(knightSpriteSheet, 'run'),17, 10, 16, 8, 8, 8,[2,6], 4, [1, 1], 1, 1),
  new Unit("rouge",0, 2,new createjs.Sprite(rougeSpriteSheet, 'run'),10, 17, 11, 8, 8, 10,[1,4], 0, [1, 1], 1, 1),
  new Unit("mage",1, 1,new createjs.Sprite(mageSpriteSheet, 'run'),8, 13, 11, 17, 8, 10,[1,4], 1, [1.1, 4], 1, 1),
  ];
  
  spawnLevel1Enemies();
  
  
  
   
  
   // Initial grid drawing
   drawGrid();
   addGridNumbers(); 
   
  
   drawUnits();
  
   // Get the grid position based on mouse coordinates
  
   // Add event listener for the Enter key to end the turn
   document.addEventListener("keydown", event => {
    
     if (event.key === "Enter" && turn === 'friendly') {
       endTurn();
      
       console.log(`${turn}'s turn`);
     }
     else if (selected && event.key === "Tab") {
      selected.movement -= Math.floor(Math.sqrt(Math.pow(selected.scol - selected.col, 2) + Math.pow(selected.srow - selected.row, 2)));
      gridArray[selected.srow][selected.scol] = 0;
      selected.scol = selected.col;
      selected.srow = selected.row;
  
     }
     else if (selected && event.key === "w") {
       moveToPoint(selected.col * GRID_SIZE, (selected.row - 1) * GRID_SIZE, selected);
      
     }
     else if (selected && event.key === "a") {
       moveToPoint((selected.col - 1) * GRID_SIZE, selected.row * GRID_SIZE, selected);
     }
     else if (selected && event.key === "s") {
       moveToPoint(selected.col * GRID_SIZE, (selected.row + 1) * GRID_SIZE, selected);
     }
     else if (selected && event.key === "d") {
       moveToPoint((selected.col + 1) * GRID_SIZE, selected.row * GRID_SIZE, selected);
     }
   });
  
   // Add click event listener to the canvas
   document.addEventListener("mouseup", () => {
    if(on_con_button || on_str_button || on_dex_button || on_int_button || on_dash_button){
    if(selected &&on_con_button ){
      if(selected.constitution<20 && selected.xp_points>=1){
      selected.constitution+=1;
selected.maxHealth= 10+Math.ceil((selected.constitution-10)/2);
selected.xp_points-=1;
      }
    }
    else if(selected && on_str_button ){
      if(selected.strength<20 && selected.xp_points>=1){
      selected.strength+=1;
      selected.attack = Math.max( Math.floor((selected.strength-10)/2),Math.floor((selected.dextarity-10)/2),Math.floor((selected.inteligence-10)/2));
      selected.xp_points-=1;
      }
    }
    else if(selected && on_dex_button ){
      if(selected.dextarity<20 && selected.xp_points>=1){
      selected.dextarity+=1;
      selected.maxMovement = 4+Math.floor((selected.dextarity-10)/3);
      selected.accuracy = Math.floor((selected.dextarity-10)/2);
      selected.doge = Math.floor((selected.dextarity-10));
      selected.attack = Math.max( Math.floor((selected.strength-10)/2),Math.floor((selected.dextarity-10)/2),Math.floor((selected.inteligence-10)/2));
selected.xp_points-=1;
      }
    }
    else if(selected && on_int_button ){
      if(selected.inteligence<20 && selected.xp_points>=1){
      selected.inteligence+=1;
      selected.attack = Math.max( Math.floor((selected.strength-10)/2),Math.floor((selected.dextarity-10)/2),Math.floor((selected.inteligence-10)/2));
      selected.xp_points-=1;
      }
    }
    else if(selected && on_dash_button ){
      if (selected.actions>=1){
      selected.movement += selected.maxMovement;
      selected.actions -= 1;
      console.log("dashing");
      on_dash_button = false;
      }
    }
  }
    else{

    if (currentLine>=diolog.length-1 && text_box.style.display === 'flex'){
      currentLine=0
    text_box.style.display = 'none';}
    else if(text_box.style.display === 'flex'){
      currentLine++
      text_box.innerHTML = diolog[currentLine];
      text_box.style.color = 'black';
    }

     const rect = canvas.getBoundingClientRect();
     const mouseX = event.clientX - rect.left;
     const mouseY = event.clientY - rect.top;
     const gridPosition = getGridPosition(mouseX, mouseY);
     var distance = 0
     
     
  
     console.log(`Grid position: ${gridPosition} ${gridArray[gridPosition[1]][gridPosition[0]]}`);
  
     if (selected && (gridArray[gridPosition[1]][gridPosition[0]] === 0 ||gridPosition[0]===selected.scol && gridPosition[1] ===selected.srow)) {
       moveToPoint(mouseX, mouseY, selected);
       
     }
 
     const units = turn === 'friendly' ? friendlyUnits : enemyUnits;
     const targets = turn === 'friendly' ? enemyUnits : friendlyUnits;
  if(turn === 'friendly'){
     target = targets.find(unit => unit.col === gridPosition[0] && unit.row === gridPosition[1]);
     if (target != undefined) {
       console.log("target is ", target);
     }
     else {
       selected = units.find(unit => unit.col === gridPosition[0] && unit.row === gridPosition[1]);
     }
  
     if (selected != undefined && selected.health>0) {
       console.log("selected is ", selected);
         distance = Math.sqrt(Math.pow(gridPosition[0] - selected.col, 2) + Math.pow(gridPosition[1] - selected.row, 2));

       if (target != undefined && distance <= selected.range[1] && distance >= selected.range[0] && selected.actions > 0 && isObstacleBetween(selected.col, selected.row, target.col, target.row) === false) {
        attack_sound.play();
        attack(selected,target);
      }
     }
    else{selected=undefined}
    
     if (oldSelected != selected) {
      if(oldSelected != null){
      oldSelected.col = oldSelected.scol;
      oldSelected.row = oldSelected.srow;
      }
       oldSelected = selected;
     }
    }
  }
   });

   document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    //console.log(`Mouse position: ${mouseX}, ${mouseY}`);

    if(selected != undefined && mouseX<50 && mouseY<865 && mouseX>0 && mouseY>813  ){ 
      if(selected.xp_points>=1){
      con_button.style.backgroundColor = "red";
      }
      on_con_button = true;
     }
     else if(selected != undefined && selected.xp_points>=1){
      con_button.style.backgroundColor = "gold";
      on_con_button = false;
     }
     else{
      con_button.style.backgroundColor = "gray";
      on_con_button = false;
     }

     if(selected != undefined && mouseX<100 && mouseY<865 && mouseX>=50 && mouseY>813  ){ 
      if(selected.xp_points>=1){
      str_button.style.backgroundColor = "red";
      }
      on_str_button = true;
     }
     else if(selected != undefined && selected.xp_points>=1){
      str_button.style.backgroundColor = "gold";
      on_str_button = false;
     }
     else{
      str_button.style.backgroundColor = "gray";
      on_str_button = false;
     }

      if(selected != undefined && mouseX<150 && mouseY<865 && mouseX>=100 && mouseY>813  ){
        if(selected.xp_points>=1){
        dex_button.style.backgroundColor = "red";
        }
        on_dex_button = true;
      }
      else if(selected != undefined && selected.xp_points>=1){
        dex_button.style.backgroundColor = "gold";
        on_dex_button = false;
      }
      else{
        dex_button.style.backgroundColor = "gray";
        on_dex_button = false;
      }

      if(selected != undefined && mouseX<200 && mouseY<865 && mouseX>=150 && mouseY>813  ){
        if(selected.xp_points>=1){
        int_button.style.backgroundColor = "red";
        }
        on_int_button = true;
      }
      else if(selected != undefined && selected.xp_points>=1){
        int_button.style.backgroundColor = "gold";
        on_int_button = false;
      }
      else{
        int_button.style.backgroundColor = "gray";
        on_int_button = false;
      }

      if(selected != undefined && mouseX<250 && mouseY<865 && mouseX>=200 && mouseY>813  ){
        if (selected.actions>=1){
        dash_button.style.backgroundColor = "purple";
        }
        on_dash_button = true;
      }
      else{
        dash_button.style.backgroundColor = "gray";
        on_dash_button = false;
      }
});
  

   // Update the stage on each tick
   createjs.Ticker.on("tick", () => {
   
    if(text_box.style.display === 'flex'){
      selected=null
      target=null
    }
  
     checkDeath();
  
     if (enemyUnits.length === 0) {
       newLevel();
     }

     if(friendlyUnits.length === friendlyDeadUnits.length){
      levelSong.pause();
      game_over_sound.play();
      
        alert("Game Over");

     }

     // Clear the stage and redraw the grid to show updated starting positions

     
     
     draw();
   
   });
  }
  


   if(!firstClick){
    const titleScreen = new createjs.Bitmap('images/title.png');

 
    const loadQueue = new createjs.LoadQueue(false);
loadQueue.addEventListener("fileload", handleFileLoad);
loadQueue.loadFile({id: "titleScreen", src: "images/title.png"});

function handleFileLoad(event) {
  if (event.item.id === "titleScreen") {
    const titleScreen = new createjs.Bitmap(event.result);
    stage.addChild(titleScreen);
    stage.update();
  }
}

    canvas.addEventListener("click", handleStartClick);
     canvas.addEventListener("keydown",handleStartClick);
    
    function handleStartClick() {
      firstClick=true
      canvas.removeEventListener("click", handleStartClick);
      canvas.removeEventListener("keydown", handleStartClick);
      stage.removeChild(titleScreen);
      // stage.removeChild(startScreen);
      //stage.removeChild(startText);
     
      // Add your code to start the game here
       init(); // Call the initialization function
    }
  }
 
  