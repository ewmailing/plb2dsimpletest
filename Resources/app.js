var window = Ti.UI.createWindow({backgroundColor:'black', exitOnClose:true});

// Obtain game module
//var platino = require('co.lanica.platino');
var platino = require("co.lanica.platino");
var box2d = require("co.lanica.box2d");
Ti.API.info("module is => " + box2d);

// Create view for your game.
// Note that game.screen.width and height are not yet set until the game is loaded
var game = platino.createGameView();

// Create view for your game.
// Note that game.screen.width and height are not yet set until the game is loaded
var game = platino.createGameView();

// The physics world surface accepts GameView instance.
var world = box2d.createBox2dWorld({surface:game});
//var world = box2d.createWorld({surface:game});
//world.surface = game;


// Frame rate can be changed (fps can not be changed after the game is loaded)
game.fps = 30;

// set initial background color to black
game.color(0, 0, 0);

game.debug = true;

var shapes = [];

// Create game scene
var scene = platino.createScene();

// add your scene to game view
game.pushScene(scene);

var TOUCH_SCALE = 1;

// Onload event is called when the game is loaded.
game.addEventListener('onload', function(e) {
     // We should calculate the view scale because game.size.width and height may be changed due to the parent layout.
    TOUCH_SCALE = game.screen.width  / game.size.width;
    
    // Enable MultiTouch support
    game.registerForMultiTouch();
    
    // Start the game
    game.start();
    
    
    
var redBlock = platino.createSprite({width:50, height:50});
redBlock.color(1, 0, 0);

// add the block body to the world
var redBodyRef = world.addBody(redBlock, {
	density: 12.0,
	friction: 0.3,
	restitution: 0.4,
	type: "dynamic"
});

var groundBlock = platino.createSprite({width:550, height:50});
groundBlock.color(1, 1, 0);
groundBlock.center = {x:0, y:500}
// add the block body to the world
var groundBodyRef = world.addBody(groundBlock, {
//	density: 12.0,
	friction: 0.5,
//	restitution: 0.4,
	type: "static"
});


	world.start();

});

/*
 * Listener function for 'touchstart' and 'touchstart_pointer' events.
 * Before using touch event, call registerForMultiTouch() to enable multi touch support.
 *
 * Note that ALL gesture events including 'click' and 'dblclick' are disabled on Android
 * when multi touch support is enabled
 *
 * Use e.points to handle multiple pointers.
 *
 * 'touchstart_pointer' is called when a non-primary pointer has gone down on Android.
 * 'touchstart_pointer' event is never used on iOS.
 *
 * See http://developer.android.com/reference/android/view/MotionEvent.html for details about motion events on Android.
 */
var onTouchStart = function(e) {
    
    // On Android, 'touchstart_pointer' event is called right after firing 'touchstart' event when multi touch is detected.
    
    Ti.API.info(e.type + ": " + JSON.stringify(e.points));
    
    for (var pointName in e.points) {
        
        if (typeof shapes[pointName] === 'undefined' || shapes[pointName] === null) {
            shapes[pointName] = platino.createSprite({width:64, height:64});
            
            if (e.type == 'touchstart') {
                shapes[pointName].color(1, 0, 0);  // draw red point when shape is created at touchstart
            } else if (e.type == 'touchmove') {
                shapes[pointName].color(0, 1, 0);  // draw green point when shape is created at touchmove
            } else {
                shapes[pointName].color(0, 0, 1);  // draw blue point when shape is created at touchstart__pointer
            }
            
            scene.add(shapes[pointName]);
        }
        
        shapes[pointName].center = {x: e.points[pointName].x * TOUCH_SCALE, y:e.points[pointName].y * TOUCH_SCALE};
    }
};

/*
 * Listener function for 'touchend' and 'touchend_pointer' events.
 * Before using touch event, call registerForMultiTouch() to enable multi touch support.
 * Use e.points to handle multiple pointers
 *
 * Note that ALL gesture events including 'click' and 'dblclick' are disabled on Android
 * when multi touch support is enabled
 *
 * 'touchend_pointer' is called when a non-primary pointer has gone up on Android.
 * 'touchend_pointer' event is never used on iOS.
 *
 * See http://developer.android.com/reference/android/view/MotionEvent.html for details about motion events on Android.
 */
var onTouchEnd = function(e) {
    
    // On Android, 'touchend_pointer' event is called before firing 'touchend' event when multi touch is detected.
    
    Ti.API.info(e.type + ": " + JSON.stringify(e.points));
    
    var pointName;
    for (pointName in e.points) {
        
        if (typeof shapes[pointName] === 'undefined' || shapes[pointName] === null) {
            Ti.API.info("Couldn't find touch: " + pointName);
            continue;
        }
        
        scene.remove(shapes[pointName]);
        
        shapes[pointName] = null;
        delete shapes[pointName];
    }
    
    // clear all rectangles because all poiinters are gone
    if (e.type == 'touchend') {
        for (pointName in shapes) {
            if (typeof shapes[pointName] === 'undefined' || shapes[pointName] === null) {
                continue;
            }
            scene.remove(shapes[pointName]);
            shapes[pointName] = null;
        }
        shapes.length = 0;
    }
};

var onCollision = function(e)
{
	Ti.API.info("onCollision callback: " + e);
	Ti.API.info("e.phase, e.a, e.b : " + e.phase + " " + e.a + " " + e.b);
	
}
/*
 * Listener function for 'touchmove' events.
 * Before using touch event, call registerForMultiTouch() to enable multi touch support.
 * Use e.points to handle multiple pointers
 *
 * Note that ALL gesture events including 'click' and 'dblclick' are disabled on Android
 * when multi touch support is enabled
 *
 */

game.addEventListener('touchstart', onTouchStart);
game.addEventListener('touchmove',  onTouchStart);
game.addEventListener('touchstart_pointer', onTouchStart); // Called only on Android

game.addEventListener('touchend', onTouchEnd);
game.addEventListener('touchend_pointer', onTouchEnd); // Called only on Android

world.addEventListener('collision', onCollision)


game.addEventListener('close', function (e) {
    Ti.API.info('app.js: Close event on '+Ti.Platform.osname);
});     
game.addEventListener('pause', function (e) {
    Ti.API.info('app.js: Pause event on '+Ti.Platform.osname);
    world.stop();
});     
game.addEventListener('resume', function (e) {
    Ti.API.info('app.js: Resume event on '+Ti.Platform.osname);
    world.start();
});


// Add your game view
window.add(game);
window.open({fullscreen:true, navBarHidden:true});


