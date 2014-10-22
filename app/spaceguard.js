/**********************************************************************************
 * SpaceGuard - Simple JavaScript Game
 * 
 * Initialize the global sg object with the canvas id and the game will start 
 * running automatically. 
 * @example <body onload="sg.initialize('canvas-element-id');">
 * 
 * @license GPLv3
 * @version 0.7
 * @link GitHub https://github.com/alextselegidis/SpaceGuard
 * @link Live http://alextselegidis.com/spaceguard
 *
 * Remaining Tasks:
 * @task Add animation to objects (guard, menus, parallax space background).
 * @task Add sound effects (explosions, background music, power ups).
 * @task Social network sharing of final scores (Facebook, Googel+, Twitter).
 **********************************************************************************/

// Global Constants
var SCALE = 1; 
var CANVAS_WIDTH = 800; // px
var CANVAS_HEIGHT = 600; // px
var KEY_ESCAPE = 27;
var LOOP_DELAY = 10;
var GUARD_SHIELD_BASE = 10;
var STARSHIP_SHIELD_BASE = 10;
var COMET_SCORE = 5;
var SHIELD_SCORE = 3;
var BOMB_SCORE = 5;
var LEVEL_SCORE = 100;
var CREATION_BARRIER_STEP = 5000;
var OBJ_TYPE_BOMB = 'bomb';
var OBJ_TYPE_GSHIELD = 'gshield';
var OBJ_TYPE_SSHIELD = 'sshield';

/**
 * Main game class
 */
var SpaceGuard = function() {
    var inst = this;
    inst.canvas;
    inst.ctx;
    inst.cx; // center x & y
    inst.cy; 
    inst.guard = {
        x: undefined,
        y: undefined,
        width: 50 * SCALE,
        height: 50 * SCALE,
        shield: 100,
        defuseRadius: 50
    };
    inst.starship = {
        x: undefined,
        y: undefined,
        width: 135 * SCALE,
        height: 135 * SCALE,
        shield: 100
    };
    inst.sprites = new Object();
    inst.comets;
    inst.frameUpdateTime = 1000 / 60; // 60 fps
    inst.lastUpdateTime; // last time canvas was updated
    inst.levelStartTime; // level start time - the player needs to survive for some minutes until the level is finished
    inst.pauseTime; // Stores the paused time period.
    inst.randomRollTime = 3000;
    inst.lastRollTime = new Date();
    inst.level = 0; // level var starts from 0, not from 1 (due to array index base)
    inst.score = 0;
    inst.randomObjects = [];
    inst.onDefuse = false;
    inst.currentDefuseRadius = 0; // used for graphic display
    inst.spaceBackground;
    
    /**
     * The game must start with this method.
     * 
     * @param {string} canvasId Canvas DOM element.
     * @returns {object} Returns game instance.
     */
    inst.initialize = function(canvasId) {
        inst.canvas = document.getElementById(canvasId);
        inst.ctx = inst.canvas.getContext('2d');

        // load image sprites
        GameSprites.forEach(function(sprite) {
            // var sprite = GameSprites[i];
            var img = document.createElement('img');
            img.id = sprite.id;
            img.src = sprite.src;
            img.style.display = 'none';
            document.body.appendChild(img);
            inst.sprites[sprite.id] = img; // store the element handle for later use

            // draw main screen when the images are finished loading
            if (img.id == 'introScreen' && !Environment.isMobile()) {
                img.onload = function() {
                    inst.drawIntroScreen();
                }
            }
        });

        inst.load();
        return inst;
    };

    /**
     * Loads needed resource files - display initial screen to user.
     * 
     * @returns {object} Returns game instance.
     */
    inst.load = function() {        
        // init canvas
        inst.canvas.width = CANVAS_WIDTH * SCALE;
        inst.canvas.height = CANVAS_HEIGHT * SCALE;
        inst.canvas.style.background = '#000';
        inst.cx = inst.canvas.width / 2;
        inst.cy = inst.canvas.height / 2; 
        inst.ctx.rect(0, 0, inst.canvas.width, inst.canvas.height);

        // Check if user agent is a mobile device.
        if (Environment.isMobile()) {
            inst.ctx.fillStyle = '#000';
            inst.ctx.fillRect(0, 0, inst.canvas.width * SCALE, inst.canvas.height * SCALE);
            inst.ctx.fillStyle = '#fff';
            inst.ctx.font = '14pt Arial';
            inst.ctx.textAlign = 'center';
            inst.wrapText('Unfortunately SpaceGuard cannot be played on mobile devices. Please try again from a desktop computer.', 
                (inst.canvas.width / 2) * SCALE, (inst.canvas.height / 2) * SCALE, 350 * SCALE, 25 * SCALE);
            return;
        }

        inst.drawIntroScreen();
        
        // events
        inst.canvas.addEventListener('click', inst.onClick, false);
        inst.canvas.addEventListener('contextmenu', inst.onContextMenu, false);

        return inst; 
    };

    /**
     * Start game - handles main loop
     * @returns {object} Returns game instance.
     */
    inst.game = function() {
        // init game vars
        inst.onGame = true;
        inst.onPause = false;
        inst.levelStartTime = new Date();
        inst.lastUpdateTime = new Date();
        inst.randomObjects = [];
        inst.guard.x = inst.cx;
        inst.guard.y = inst.cy;
        inst.guard.shield = GameLevels[inst.level].guard.shield;
        inst.guard.defuseRadius = GameLevels[inst.level].guard.defuseRadius;
        inst.guard.img = document.getElementById('guard');
        inst.starship.x = inst.cx - (inst.starship.width / 2);
        inst.starship.y = inst.cy - (inst.starship.height / 2);
        inst.starship.shield = GameLevels[inst.level].starship.shield;
        inst.starship.img = document.getElementById('starship');

        // create comets
        inst.comets = [];
        for (var i = 0; i < 10; i++) {
            inst.comets.push(new Comet(inst));
            inst.comets[i].position();
        }

        // add event listeners
        inst.canvas.addEventListener('keyup', inst.onKeyUp);
        inst.canvas.addEventListener('mousemove', inst.onMouseMove);
        inst.canvas.addEventListener('mouseout', inst.onMouseOut);
        inst.canvas.style['cursor'] = 'none';

        // splash screen
        inst.splash('Level ' + (inst.level + 1), 1000, function() {
            requestAnimFrame(inst.loop);
        });

        return inst;
    };
    
    inst.drawBackground = function() {
        // clear stuff
        inst.ctx.clearRect(0, 0, inst.canvas.width, inst.canvas.height);

        // starship
        inst.ctx.drawImage(inst.sprites.starship, inst.starship.x * SCALE, inst.starship.y * SCALE);
    };

    inst.drawObjects = function() {
        // guard
        inst.ctx.drawImage(inst.sprites.guard, inst.guard.x * SCALE, inst.guard.y * SCALE);

        if (inst.onDefuse) {
            inst.ctx.beginPath();
            inst.ctx.strokeStyle = '#57BCFF';
            inst.ctx.lineWidth = 2;
            inst.ctx.arc(inst.guard.x + 25, inst.guard.y + 25, inst.currentDefuseRadius, 0, 2 * Math.PI);
            inst.ctx.stroke();
        }

        // comets
        inst.comets.forEach(function(comet) {
            comet.draw();
            if (inst.collides(comet, inst.guard)) {
                comet.destroyed = true;
                inst.guard.shield -= Math.ceil(comet.damage / 4); // quarter damage for the shield
                inst.score += COMET_SCORE; // fixed value  
            }
            
            if (inst.collides(comet, inst.starship)) {
                comet.destroyed = true;
                inst.starship.shield -= comet.damage;  
            }
            
            if (comet.destroyed) { // remove it from the array
                var index = inst.comets.indexOf(comet);
                if (index > -1) inst.comets.splice(index, 1);
            }
        });
        
        // When the level starts there is a creation barrier that will 
        // slowly fade
        var time = inst.datediff(new Date(), inst.levelStartTime).ms;
        creationBarrier = (time < CREATION_BARRIER_STEP) ? (CREATION_BARRIER_STEP - time) / 10 : 0; 

        // When the level is about to end then we need to stop once again
        // the creation of new comets
        if (time > CREATION_BARRIER_STEP && (GameLevels[inst.level].time * 60 * 1000) - time < CREATION_BARRIER_STEP) {
            creationBarrier = (CREATION_BARRIER_STEP - ((GameLevels[inst.level].time * 60 * 1000) - time)) / 10;
            if (creationBarrier > CREATION_BARRIER_STEP) creationBarrier = CREATION_BARRIER_STEP;
        }

        // create objects
        var rand = Math.ceil(Math.random() * 1000) - creationBarrier;
        if (rand >= inst.convertRate(GameLevels[inst.level].comet.creationRate)) {
            var comet = new Comet(inst);
            comet.position();
            inst.comets.push(comet);
        }
    };
    
    inst.drawRandomObjects = function() {
        var roll = (inst.datediff(new Date(), inst.lastRollTime).ms > inst.randomRollTime);
        var creation = false; // creation flag - we need only one creation at a time
        if (roll) inst.lastRollTime = new Date();

        // Create Bomb
        rand = Math.round(Math.random() * 1000) + 1;
        if (rand >= inst.convertRate(GameLevels[inst.level].bomb.creationRate) && roll) {
            inst.randomObjects.push(new Bomb(inst));
            creation = true;
        }
        
        // Create Guard Shield
        rand = Math.round(Math.random() * 1000) + 1;
        if (rand >= inst.convertRate(GameLevels[inst.level].guardShield.creationRate) && roll && !creation) {
            inst.randomObjects.push(new GuardShield(inst));
            creation = true;
        }
        
        // Create Starship Shield
        rand = Math.round(Math.random() * 1000) + 1;
        if (rand >= inst.convertRate(GameLevels[inst.level].starshipShield.creationRate) && roll && !creation) {
            inst.randomObjects.push(new StarshipShield(inst));   
            creation = true;
        }
        
        // Draw & Check Collision
        inst.randomObjects.forEach(function(obj) {
            switch(obj.type) {
                case OBJ_TYPE_BOMB: 
                    inst.ctx.drawImage(inst.sprites.bomb, obj.x, obj.y);
                    break;
                case OBJ_TYPE_GSHIELD: 
                    inst.ctx.drawImage(inst.sprites.gshield, obj.x, obj.y);
                    break;
                case OBJ_TYPE_SSHIELD: 
                    inst.ctx.drawImage(inst.sprites.sshield, obj.x, obj.y);
                    break;
            }

            if (inst.collides(obj, inst.guard)) 
                obj.trigger();    
            
            if (obj.destroyed) {
                var index = inst.randomObjects.indexOf(obj);
                if (index > -1) inst.randomObjects.splice(index, 1);
            }
        });
    };

    inst.pause = function() {
        inst.ctx.fillStyle = 'black';
        inst.ctx.fillRect(0, 0, inst.canvas.width * SCALE, inst.canvas.height * SCALE);
        inst.drawCredits();
        inst.ctx.fillStyle = 'white';
        inst.ctx.font = '24pt Arial';
        inst.ctx.textAlign = 'center';
        inst.ctx.fillText('Paused!', inst.canvas.width * SCALE / 2, inst.canvas.height * SCALE / 2);
        inst.ctx.font = '14pt Arial';
        inst.ctx.fontStyle = '#EEE';
        inst.ctx.fillText('Click the right mouse button to continue.', inst.canvas.width * SCALE / 2, inst.canvas.height * SCALE / 2 + 30);
        inst.drawStats(true);

        if (!inst.onPause) {
            inst.canvas.style['cursor'] = 'none';
            var diff = new Date() - inst.pauseTime;
            inst.levelStartTime.setMilliseconds(diff);
            inst.loop();
            return;
        }
        requestAnimFrame(inst.pause, inst.canvas);
    };

    inst.loop = function() {
        var message, callback, duration;

        if (inst.onPause) {
            inst.canvas.style['cursor'] = 'default';
            inst.pauseTime = new Date();
            inst.pause();
            return;
        }

        if (!inst.onGame)
            return;

        if (inst.datediff(new Date(), inst.lastUpdateTime).ms > inst.frameUpdateTime) {
            inst.drawBackground();
            inst.drawCredits();
            inst.drawRandomObjects();
            inst.drawObjects(); 
            inst.drawStats();
            inst.lastUpdateTime = new Date();
        }            
        
        if (inst.guard.shield <= 0 || inst.starship.shield <= 0) {
            // reset game - game over
            inst.onGame = false;
            inst.onPause = false;
            //inst.level = 0; 
            inst.clearEventListeners();
            message = ((inst.guard.shield <= 0) ? 'Guard Destroyed!' : 'Starship Destroyed!') + ' Score ' + inst.score + ' (-50%)';
            inst.splash(message, 2000, inst.load);
            inst.score = (inst.score > 0) ? Math.round(inst.score / 2) : 0; // if the player is destroyed he'll just lose half of his score
            return;
        }
        
        if (inst.datediff(new Date(), inst.levelStartTime).ms > GameLevels[inst.level].time * 60 * 1000) {
            inst.onGame = false;
            inst.onPause = false;
            

            if (inst.level < GameLevels.length) {
                message = 'Level Completed!';
                callback = inst.game;
                duration = 2000;
                inst.level++;
            } else {
                message = 'Congrats! You\'ve Completed All Game Levels - Score ' + inst.score;
                callback = inst.load;
                duration = 5000;
                inst.level = 0;
            }
            
            inst.splash(message, duration, callback);
            return;
        }

        requestAnimFrame(inst.loop, inst.canvas);
    };

    inst.clearEventListeners = function() {
        inst.canvas.removeEventListener('click', inst.onClick, false);
        inst.canvas.removeEventListener('contextmenu', inst.onContextMenu, false);
        inst.canvas.removeEventListener('mousemove', inst.onMouseMove, false);
        inst.canvas.removeEventListener('mouseout', inst.onMouseOut, false);
        inst.canvas.removeEventListener('keyup', inst.onKeyUp, false);
    };

    inst.onMouseMove = function(e) {
        inst.guard.x = (e.pageX - inst.canvas.offsetLeft - 15) * SCALE;
        inst.guard.y = (e.pageY - inst.canvas.offsetTop - 15) * SCALE;
    };

    inst.onMouseOut = function(e) {
        inst.onPause = true;
    };

    inst.onClick = function(e) {
        if (inst.onGame && !inst.onPause) inst.bombDefuse(); // *** must be executed before the next command!
        if (!inst.onGame && !inst.onPause) inst.game();
    };

    inst.onKeyUp = function(e) {
        if (e.keyCode == KEY_ESCAPE && !inst.onPause) {
            inst.onGame = false;
            inst.onPause = false;
            // reset stuff
            inst.score = 0; 
            inst.level = 0; 
            inst.clearEventListeners();
            inst.splash('Game Over', 1000, inst.load);

        }
    };
    
    inst.onContextMenu = function(e) {
        if (inst.onGame && !inst.onPause) inst.onPause = true;
        else if (inst.onGame && inst.onPause) inst.onPause = false;
        e.preventDefault();
        return false;
    }
    
    inst.datediff = function(date1, date2) {
        // @link http://stackoverflow.com/a/7709819/1718162
        // @link http://stackoverflow.com/a/13894670/1718162
        var diff = {};
        diff.ms = (date1 - date2);
        diff.days = Math.round(diff.ms / 86400000);
        diff.hours = Math.round((diff.ms % 86400000) / 3600000);
        diff.minutes = Math.round(((diff.ms % 86400000) % 3600000) / 60000); 
        diff.seconds = parseInt((date1.getTime() - date2.getTime()) / 1000); 
        return diff;
    };

    /**
     * Check collision between objects.
     * @param {object} obj1{x, y, width, height}
     * @param {object} obj2{x, y, width, height}
     * @returns {bool}
     */
    inst.collides = function(obj1, obj2) {
        var x1, y1, w1, h1; // obj1
        var ox, oy, ow, oh; // obj2
        
        x1 = obj1.x;
        y1 = obj1.y;
        w1 = obj1.width;
        h1 = obj1.height;
        
        x2 = obj2.x;
        y2 = obj2.y;
        w2 = obj2.width;
        h2 = obj2.height;
        
        // check whether objects collide
        return (((x1 < x2 && (x1 + w1) > x2) 
                || (x1 > x2 && (x1 + w1) < (x2 + w2))
                || (x1 > x2 && x1 < (x2 + w2))) && 
            ((y1< y2 && (y1 + h1) > y2) 
                || (y1 > y2 && (y1 + h1) < (y2 + h2))
                || (y1 > y2 && y1 < (y2 + h2)))) 
            ? true : false;
    };

    inst.drawStats = function(onPause) {
        var currDate = (!onPause) ? new Date() : inst.lastUpdateTime;
        var time = inst.datediff(currDate, inst.levelStartTime);
        var diff = new Date((GameLevels[inst.level].time * 60 * 1000) - time.ms);
        var minutes = (diff.getMinutes() < 10) ? '0' + diff.getMinutes() : diff.getMinutes();
        var seconds = (diff.getSeconds() < 10) ? '0' + diff.getSeconds() : diff.getSeconds();

        inst.ctx.textAlign = 'left';
        inst.ctx.font = 12 * SCALE + 'pt Arial';
        inst.ctx.fillStyle = '#5CFF8F';

        inst.ctx.fillText('Level ' + (inst.level + 1), 20 * SCALE, 30 * SCALE);
        inst.ctx.fillText('Time ' + minutes + ':' + seconds, 20 * SCALE, 50 * SCALE); // time
        inst.ctx.fillText('Score ' + inst.score, 20 * SCALE, 70 * SCALE); // score

        inst.ctx.textAlign = 'right';
        inst.ctx.lineWidth = '1';
        var gColor = inst.getBarColor(inst.guard.shield, onPause);
        var sColor = inst.getBarColor(inst.starship.shield, onPause);

        inst.ctx.fillStyle = gColor;
        inst.ctx.fillText('Guard ' + inst.guard.shield + '%', (inst.canvas.width - 20) * SCALE, 30 * SCALE); // guard
        inst.ctx.fillStyle = sColor;
        inst.ctx.fillText('Starship ' + inst.starship.shield + '%', (inst.canvas.width - 20) * SCALE, 80 * SCALE); // starship
        
        gColor = inst.getBarColor(inst.guard.shield, onPause, true);
        sColor = inst.getBarColor(inst.starship.shield, onPause, true);

        inst.ctx.strokeStyle = gColor;
        inst.ctx.strokeRect((inst.canvas.width - 152) * SCALE, 40, 130, 15);
        inst.ctx.fillStyle = gColor;
        inst.ctx.fillRect((inst.canvas.width - 152) * SCALE, 40, inst.guard.shield / 100 * 130, 15);

        inst.ctx.strokeStyle = sColor;
        inst.ctx.strokeRect((inst.canvas.width - 152) * SCALE, 90, 130, 15);
        inst.ctx.fillStyle = sColor;
        inst.ctx.fillRect((inst.canvas.width - 152) * SCALE, 90, inst.starship.shield / 100 * 130, 15);
    };

    inst.getBarColor = function(value, onPause, opaque) {
        var color;

        if (value > 70)
            color = (!onPause && opaque) ? 'rgba(92, 255, 201, 0.9)' : '#5CFFC9'; // cyan
        else if (value > 40) 
            color = (!onPause && opaque) ? 'rgba(92, 255, 143, 0.9)' : '#5CFF8F'; // green
        else if (value > 15)
            color = (!onPause && opaque) ? 'rgba(255, 149, 92, 0.9)' : '#FF955C'; // orange
        else 
            color = (!onPause && opaque) ? 'rgba(255, 92, 92, 0.9)' : '#FF5C5C'; // red
            
        return color;
    };

    /**
     * The guard is able to defuse nearby bomb, but this will also 
     * destroy any nearby objects.
     */
    inst.bombDefuse = function() {
        if (inst.onDefuse) return false;

        inst.onDefuse = true; 
        var defuseInterval = setInterval(function() {
            inst.currentDefuseRadius++;
            inst.randomObjects.forEach(function(obj) {
                distance = Math.sqrt(Math.pow((inst.guard.x + 15 - obj.x), 2) + Math.pow((inst.guard.y + 15 - obj.y), 2));
                if (distance <= inst.currentDefuseRadius) {
                    obj.destroyed = true;
                    if (obj.type == OBJ_TYPE_BOMB) inst.score += BOMB_SCORE;
                }
            });
            if (inst.currentDefuseRadius == inst.guard.defuseRadius) {
                clearInterval(defuseInterval);
                inst.currentDefuseRadius = 0;
                inst.onDefuse = false;
            }
        }, 7);
    };

    /**
     * Display splash screen with a custom message.
     * @param  {string}   text     The message to be displayed on the splash screen.
     * @param  {int}   duration The ammount of time that the splash screen will remain on canvas.
     * @param  {function} callback This method will be called after the splash is finished.
     */
    inst.splash = function(text, duration, callback) {
        var drawStartTime = new Date();
        var drawSplashScreen = function () {
            inst.ctx.fillStyle = 'black';
            inst.ctx.fillRect(0, 0, inst.canvas.width * SCALE, inst.canvas.height * SCALE);    
            inst.ctx.fillStyle = 'white';
            inst.ctx.font = '24pt Arial';
            inst.ctx.textAlign = 'center';
            inst.ctx.fillText(text, inst.canvas.width * SCALE / 2, inst.canvas.height * SCALE / 2);

            if (inst.datediff(new Date(), drawStartTime).ms > duration)  { // end of splash screen
                if (callback) callback();
                return;
            }

            requestAnimFrame(drawSplashScreen, inst.canvas);
        }
        drawSplashScreen();
    };

    /**
     * Converts the creation rate from percentage into a value that will be 
     * compared with the random value.  
     * @param  {int} rate Creation rate in percentage.
     * @return {int} Returns the number that is going to be compared with the random value.
     */
    inst.convertRate = function(rate) {
        return (1000 - rate * 10);
    };

    inst.drawCredits = function() {
        inst.ctx.fillStyle = '#515151';
        inst.ctx.font = '8pt Arial';
        inst.ctx.textAlign = 'right';
        inst.ctx.fillText('(C) Copyright ' + (new Date().getFullYear())  + ' - AlexTselegidis.Com', (inst.canvas.width - 10) * SCALE, (inst.canvas.height - 10) * SCALE )
    };

    // @link http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
    inst.wrapText = function(text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = inst.ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                inst.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        inst.ctx.fillText(line, x, y);
    };

    inst.timestamp = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };

    inst.drawIntroScreen = function() {
        // splash
        inst.ctx.drawImage(inst.sprites.introScreen, 1, 1);

        // text
        inst.ctx.font = (30 * SCALE).toString() + 'pt helvetica';
        inst.ctx.textAlign = 'center';
        inst.ctx.fillStyle = '#fff';
        inst.ctx.fillText('SpaceGuard', inst.cx, inst.cy - 220 * SCALE);
        inst.ctx.font = (20 * SCALE).toString() + 'pt helvetica';
        inst.ctx.fillText('Click to Start', inst.cx, inst.cy + 250 * SCALE);
        inst.canvas.style['cursor'] = 'default';

        return inst;
    };
};

/**
 * (OBJECT) Handles the comets animation.
 * @param {object} sg SpaceGuard game instance.
 */
var Comet = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.x;
    inst.y;
    inst.a; // extra direction handling
    inst.width = 60 * SCALE;
    inst.height = 60 * SCALE;
    inst.speedX = GameLevels[inst.sg.level].comet.speed * Math.random();
    inst.speedY = GameLevels[inst.sg.level].comet.speed * Math.random();
    inst.damage = Math.floor(Math.random() * GameLevels[inst.sg.level].comet.damage);
    inst.dfs = 30 * SCALE; // initial distance from scene
    inst.destroyed = false;
    
    inst.position = function() {
        var canvasSide = Math.ceil(Math.random() * 4);

        switch(canvasSide) {
            case 1: // top
                inst.y = -1 * inst.dfs;
                inst.x = Math.ceil(Math.random() * sg.canvas.width);
                if (inst.x > inst.sg.canvas.width / 2) inst.speedX = -1 * inst.speedX;
                inst.speedY = -1 * inst.speedY;
                break;
            case 2: // right
                inst.x = sg.canvas.width + inst.dfs;
                inst.y = Math.ceil(Math.random() * sg.canvas.height);
                if (inst.y > inst.sg.canvas.height / 2) inst.speedY = -1 * inst.speedY;
                inst.speedX = -1 * inst.speedX;
                break;
            case 3:  // bottom
                inst.y = sg.canvas.height + inst.dfs;
                inst.x = Math.ceil(Math.random() * sg.canvas.width);
                if (inst.x > inst.sg.canvas.width / 2) inst.speedX = -1 * inst.speedX;
                break;
            case 4: // left
                inst.x = -1 * inst.dfs;
                inst.y = Math.ceil(Math.random() * sg.canvas.height);
                if (inst.y > inst.sg.canvas.height / 2) inst.speedY = -1 * inst.speedY;
        }

        inst.a = Math.random() * 1;
    };

    inst.draw = function() {
        // move
        inst.x += inst.a * Math.ceil(Math.random() * inst.speedX) + Math.round(inst.speedX / 2);
        inst.y += inst.a * Math.ceil(Math.random() * inst.speedY) + Math.round(inst.speedY / 2);
        
        // check if comet is out of map
        inst.isOutOfMap();

        // draw
        inst.sg.ctx.drawImage(inst.sg.sprites.comet, inst.x, inst.y);
    };

    inst.isOutOfMap = function() {
        // if the comet is too far from the map frame it means that 
        // it needs to be destroyed cause it will no longer play any 
        // part on the game
        var dist = Math.abs(Math.sqrt(Math.pow(inst.x - inst.sg.cx, 2) + Math.pow(inst.y - inst.sg.cy, 2)));
        if (dist > (inst.sg.canvas.width))
            inst.destroyed = true;
    }
};

/**
 * (RANDOM OBJECT) Guard shield power up. 
 * @param {object} sg SpaceGuard game instance.
 */
var GuardShield = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.type = OBJ_TYPE_GSHIELD;
    inst.color = '#36BDEB';
    inst.destroyed = false;
    inst.x = Math.round(Math.random() * inst.sg.canvas.width * SCALE);
    inst.y = Math.round(Math.random() * inst.sg.canvas.height * SCALE);
    inst.width = 30 * SCALE;
    inst.height = 30 * SCALE;
    inst.shield = 10; // base power up value
    inst.value = Math.round(Math.random() * inst.shield) + inst.shield;

    inst.trigger = function() {
        inst.sg.guard.shield += inst.value;
         if (inst.sg.guard.shield > GameLevels[inst.sg.level].guard.shield) 
            inst.sg.guard.shield = GameLevels[inst.sg.level].guard.shield;
        inst.sg.score += SHIELD_SCORE;
        inst.destroyed = true;
    };
}

/**
 * (RANDOM OBJECT) Starship shield power up. 
 * @param {object} sg SpaceGuard game instance.
 */
var StarshipShield = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.type = OBJ_TYPE_SSHIELD;
    inst.color = '#36EB57';
    inst.x = Math.round(Math.random() * inst.sg.canvas.width * SCALE);
    inst.y = Math.round(Math.random() * inst.sg.canvas.height * SCALE);
    inst.width = 30 * SCALE;
    inst.height = 30 * SCALE;
    inst.shield = 10; // base power up value
    inst.value = Math.round(Math.random() * inst.shield) + inst.shield;

    inst.trigger = function() {
        inst.sg.starship.shield += inst.value;
        if (inst.sg.starship.shield > GameLevels[inst.sg.level].starship.shield) 
            inst.sg.starship.shield = GameLevels[inst.sg.level].starship.shield;
        inst.sg.score += SHIELD_SCORE;
        inst.destroyed = true;
    };
}

/**
 * (RANDOM OBJECT) Bomb that explodes when the guard collides with it.
 * @param {object} sg SpaceGuard game instance.
 */
var Bomb = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.type = OBJ_TYPE_BOMB;
    inst.color = '#6C17AD';
    inst.x = Math.round(Math.random() * inst.sg.canvas.width * SCALE);
    inst.y = Math.round(Math.random() * inst.sg.canvas.height * SCALE);
    inst.width = 30 * SCALE;
    inst.height = 30 * SCALE;
    inst.damage = 20; // base damage value
    inst.value = Math.ceil(Math.random() * inst.damage) + inst.damage;

    inst.trigger = function() {
        inst.sg.guard.shield -= inst.value;
        inst.destroyed = true;
    };
}

// Check user agent device type.
// @link http://stackoverflow.com/a/16755700/1718162
var Environment = {
    //mobile or desktop compatible event name, to be used with '.on' function
    TOUCH_DOWN_EVENT_NAME: 'mousedown touchstart',
    TOUCH_UP_EVENT_NAME: 'mouseup touchend',
    TOUCH_MOVE_EVENT_NAME: 'mousemove touchmove',
    TOUCH_DOUBLE_TAB_EVENT_NAME: 'dblclick dbltap',

    isAndroid: function() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    isMobile: function() {
        return (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS() || Environment.isOpera() || Environment.isWindows());
    }
};

// Cross Browser requestAnimationFrame compatibility.
// @link http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Level Definition
 *
 * Adjusts the way SpaceGuard is going to handle each level. The game 
 * should become more and more hard to play as the user progress advances.
 * @type {Array}
 */
var GameLevels = [
    // lvl 1
    {
        time: 1, // minutes
        background: 'img-path', // image element id
        guard: {
            shield: 100, // % percent
            defuseRadius: 80
        },
        starship: {
            shield: 100 // % percent
        },
        comet: {
            speed: 7 * SCALE, // points
            damage: 10, // points
            creationRate: 15  // % percent
        },
        bomb: {
            creationRate: 35 // % percent
        },
        guardShield: {
            creationRate: 20 // % percent
        },
        starshipShield: {
            creationRate: 10 // % percent
        }
    },
    // lvl 2
    {
        time: 2,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 85
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 8 * SCALE,
            damage: 13,
            creationRate: 20  // if higher less will be created
        },
        bomb: {
            creationRate: 40
        },
        guardShield: {
            creationRate: 20
        },
        starshipShield: {
            creationRate: 12
        }
    },
    // lvl 3
    {
        time: 2,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 85
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 8 * SCALE,
            damage: 13,
            creationRate: 25  // if higher less will be created
        },
        bomb: {
            creationRate: 40
        },
        guardShield: {
            creationRate: 22
        },
        starshipShield: {
            creationRate: 15
        }
    },
    // lvl 4
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 90
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 8 * SCALE,
            damage: 20,
            creationRate: 35  // if higher less will be created
        },
        bomb: {
            creationRate: 45
        },
        guardShield: {
            creationRate: 30
        },
        starshipShield: {
            creationRate: 25
        }
    },
    // lvl 5
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 90
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        starshipShield: {
            creationRate: 25
        }
    },
    // lvl 6
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 95
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        starshipShield: {
            creationRate: 25
        }
    },
    // lvl 7
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 95
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        starshipShield: {
            creationRate: 25
        }
    },
    // lvl 8
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 95
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        starshipShield: {
            creationRate: 25
        }
    },
    // lvl 9
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 100
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        starshipShield: {
            creationRate: 25
        }
    },
    // lvl 10
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100, 
            defuseRadius: 110
        },
        starship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        starshipShield: {
            creationRate: 25
        }
    }
];

/**
 * Sprites Definition
 *
 * All the game sprites are loaded dynamically by this script. Just
 * add a new item on the array.
 * 
 * @type {Array}
 */
var GameSprites = [  
    {
        id: 'guard',
        src: 'img/guard.png'
    },
    {
        id: 'comet',
        src: 'img/comet.png'
    },
    {
        id: 'bomb',
        src: 'img/bomb.png'
    },
    {
        id: 'gshield',
        src: 'img/gshield.png'
    },
    {
        id: 'sshield',
        src: 'img/sshield.png'
    },
    {
        id: 'starship',
        src: 'img/starship.png'
    },
    {
        id: 'introScreen',
        src: 'img/introScreen.png'
    }
];

// Define global SpaceGuard object.
var sg = new SpaceGuard();