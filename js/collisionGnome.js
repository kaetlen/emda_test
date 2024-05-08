/* globals createjs */
;
(function(window, document, undefined) {  
	// collisionGnomeTiefling.js by Adam "AdRoque" Callaway updated by Miles Inada in 2019
	//		V1
	// 		* Now accurately incorporates .scale into bounding box calculation!
	// 		* Adds a stage reference method - collisionGnome.setStage(myStage);
	//			collisionGnome.setStage() passes us the Stage from the main document.
	// 			Once we have the Stage, we can add our debug boxes as children of the Stage using addChild().
	//			This allows the debug boxes to be removed whenever myStage.removeAllChildren() is called.
	//			Make sure to use .setStage before you call .setDebug()! I call .setStage() in initGame() and .setDebug() in initLevel()
	
	window.collisionGnome = window.collisionGnome || {};

	var COLLISION_GNOME_DEBUG = false;

	var _theStage;
	
	function setDebug(cgDebug) {
		COLLISION_GNOME_DEBUG = cgDebug;
	}

	function getSource(sprite) {
		if (sprite instanceof createjs.Bitmap) {
			return {"type": "Bitmap", "source": sprite.image, "event": 'load'}; 
		} else if (sprite instanceof createjs.Sprite) {
			return {"type": "Sprite", "source": sprite.spriteSheet, "event": 'complete'};
    } else if (sprite instanceof createjs.Shape) {
      if(sprite.graphics.command.h != undefined){
        return {"type": "Shape", width: sprite.graphics.command.w, height: sprite.graphics.command.h};
      }else if(sprite.graphics.command.radius != undefined){
        return {"type": "Shape", width: sprite.graphics.command.radius*2, height: sprite.graphics.command.radius*2};
      }
    } else {
			console.log("ERROR: centerRegistration() : " + sprite + " is not a valid createjs Bitmap or Sprite.");
			return null;
		}
	}

	function centerRegistration(sprite) {
    if(sprite instanceof createjs.Shape){
      if(sprite.graphics.command.w != undefined){
         sprite.regX = Math.floor(sprite.graphics.command.w / 2);  
         sprite.regY = Math.floor(sprite.graphics.command.h / 2);
      }else{
        sprite.regX = sprite.graphics.command.radius;
        sprite.regY = sprite.graphics.command.radius;
      } 
    }else{
      var bounds = sprite.getBounds();
      sprite.regX = Math.floor(bounds.width / 2);
      sprite.regY = Math.floor(bounds.height / 2);
    }

	} //centerRegistration

	function actuallyAddCollider(sprite, spriteInfo, hitBoxRatio) {
		centerRegistration(sprite);

		var ratio = hitBoxRatio || 1.0;
		if (hitBoxRatio < 0.2) hitBoxRatio = 0.2; //make sure they don't accidentally make tiny or enormous colliders
		if (hitBoxRatio > 5.0) hitBoxRatio = 5.0;

		if (spriteInfo.type == "Bitmap") {
			sprite.yDist = Math.floor(sprite.image.height / 2 * ratio*sprite.scaleY);
			sprite.xDist = Math.floor(sprite.image.width / 2 * ratio*sprite.scaleX);
			//console.log("Bitmap xDist: " + sprite.xDist + " yDist: " + sprite.yDist);
		} else if (spriteInfo.type == "Sprite") {
			sprite.yDist = sprite.regX * ratio * sprite.scaleX;
			sprite.xDist = sprite.regY * ratio * sprite.scaleY;
			console.log("Sprite xDist: " + sprite.xDist + " yDist: " + sprite.yDist);
		} else if (spriteInfo.type == "Shape"){
      sprite.xDist = Math.floor(sprite.regX * ratio*sprite.scaleX);
      sprite.yDist = Math.floor(sprite.regY * ratio*sprite.scaleY);
    }
		sprite.collidesWith = function(other) {
			if (!other.xDist || !other.yDist) {
				console.log("ERROR: object " + other.toString() + " at [x:" + other.x + ", y:" + other.y + "] does not have a collisionGnome collider!");
				return false;
			}

			//draw the bounding boxes if the debug variable is true -- this isn't part of the collision functionality, just a debug feature
			if (COLLISION_GNOME_DEBUG) {
				//create & draw hitbox of other
				if (!other.debox) {
          other.debox = new createjs.Shape();
          other.debox.graphics.beginStroke("#00F");
          other.debox.graphics.setStrokeStyle(1);
          other.debox.snapToPixel = true;
          other.debox.graphics.drawRect(0, 0, other.xDist * 2, other.yDist * 2);
        }
        other.debox.x = other.x - other.xDist;
        other.debox.y = other.y - other.yDist;
        if (!other.addedDebox) {
          _theStage.addChild(other.debox);
          other.addedDebox = true;
        }
        //create & draw hitbox of sprite
        if (!sprite.debox) {
          sprite.debox = new createjs.Shape();
          sprite.debox.graphics.beginStroke("#F00");
          sprite.debox.graphics.setStrokeStyle(1);
          sprite.debox.snapToPixel = true;
          sprite.debox.graphics.drawRect(
            0,
            0,
            sprite.xDist * 2,
            sprite.yDist * 2
          );
        }
        if(sprite.graphics.command.h == undefined){
          sprite.debox.x = sprite.x;
          sprite.debox.y = sprite.y;
        }else{
          sprite.debox.x = sprite.x - sprite.xDist;
          sprite.debox.y = sprite.y - sprite.yDist;
        }
        if (!sprite.addedDebox) {
          _theStage.addChild(sprite.debox);
          sprite.addedDebox = true;
        }
      }

			return (!(sprite.x - sprite.xDist >= other.x + other.xDist ||
				sprite.x + sprite.xDist <= other.x - other.xDist ||
				sprite.y - sprite.yDist >= other.y + other.yDist ||
				sprite.y + sprite.yDist <= other.y - other.yDist
			));
		}; //end of the definition of sprite.collidesWith

	}

	function addCollider(sprite, hitBoxRatio) {
		var spriteInfo = getSource(sprite);
		if (!spriteInfo) {
			console.log("ERROR: addCollider() : " + sprite + " is not a valid createjs Bitmap or Sprite.");
			return;
			
		} else {
			sprite.collidesWith = function(other) {
				return false;
			};
      if(spriteInfo.type == "Shape"){
        actuallyAddCollider(sprite, spriteInfo, hitBoxRatio);
      }else if (!(spriteInfo.source.complete)) {
				spriteInfo.source.addEventListener(spriteInfo.event, function() {
					actuallyAddCollider(sprite, spriteInfo, hitBoxRatio);
				}); 
			} else {
				actuallyAddCollider(sprite, spriteInfo, hitBoxRatio);
			}
		} //end of else
	} //end of function addCollider

	function setStage(aStage){		// takes a createjs.Stage object
		_theStage = aStage;
	}


	window.collisionGnome.addCollider = addCollider;
	window.collisionGnome.centerRegistration = centerRegistration;
	window.collisionGnome.setDebug = setDebug;
	window.collisionGnome.setStage = setStage;

}(this, document));