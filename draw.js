/* global keyMonkey, createjs,*/


function drawDot() {
            var canvas = document.getElementById('myCanvas');
            var stage = new createjs.Stage(canvas);

            // Define dot properties
            var dotSize = 10;
            var dotColor = 'blue';
            var dotX = canvas.width / 2;
            var dotY = canvas.height / 2;

            // Create a shape for the dot
            var dot = new createjs.Shape();
            dot.graphics.beginFill(dotColor).drawCircle(0, 0, dotSize);
            dot.x = dotX;
            dot.y = dotY;

            // Add dot to the stage
            stage.addChild(dot);
            
        };

       drawDot(); // Call the function to draw the dot