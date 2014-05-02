/***********************************************************************************
 * SpaceGuard - Simple HTML5 Browser Game
 * 
 * Initialize the global sg object with the canvas id and the game will start 
 * running automatically. 
 * 
 * @license GPLv3
 * @link GitHub https://github.com/alextselegidis/SpaceGuard
 * @link Live http://alextselegidis.com/spaceguard
 * 
 * Version 1.0
 * @task Fix commet movement
 * @task Complete guard and bombs activities
 * @task Add sound
 * @task Add graphics
 * @task Adjust resolution for smooth animation
 * @task optimize code for better performance
 **********************************************************************************/

// Global Constants
var SCALE = 0.4;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var KEY_ESCAPE = 27;
var LOOP_DELAY = 10;
var GUARD_SHIELD_BASE = 10;
var STARSHIP_SHIELD_BASE = 10;
var COMMET_SCORE = 5;
var SHIELD_SCORE = 3;
var LEVEL_SCORE = 100;

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
        width: 30 * SCALE,
        height: 30 * SCALE,
        shield: 100
    };
    inst.starship = {
        x: undefined,
        y: undefined,
        width: 100 * SCALE,
        height: 100 * SCALE,
        shield: 100
    };
    inst.commets;
    inst.frameUpdateTime = 1000 / 60; // 60 fps
    inst.lastUpdateTime; // last time canvas was updated
    inst.levelStartTime; // level start time - the player needs to survive for some minutes until the level is finished
    inst.level = 0;
    inst.score = 0;
    inst.randomObjects = [];
    
    
    /**
     * The game must start with inst method.
     * @param {string} canvasId Canvas DOM element.
     * @returns {object} Returns game instance.
     */
    inst.initialize = function(canvasId) {
        inst.canvas = document.getElementById(canvasId);
        inst.ctx = inst.canvas.getContext('2d');
        // @task Adjust resolution of the canvas object so the client
        // displays smooth animation. Depending the adjustment percentage
        // all the elements of the game will need to scale down.
        inst.load();
        return inst;
    };

    /**
     * Loads needed resource files.
     * @returns {object} Returns game instance.
     */
    inst.load = function() {        
        // background
        inst.canvas.width = CANVAS_WIDTH * SCALE;
        inst.canvas.height = CANVAS_HEIGHT * SCALE;
        inst.cx = inst.canvas.width / 2;
        inst.cy = inst.canvas.height / 2; 
        inst.ctx.rect(0, 0, inst.canvas.width, inst.canvas.height);
        var gradient = inst.ctx.createRadialGradient(inst.cx, inst.cy, 400, inst.cx, inst.cy, 100);
        gradient.addColorStop(1, '#000');
        gradient.addColorStop(0, '#222');
        inst.ctx.fillStyle = gradient;
        inst.ctx.fill(); 

        // planet
        inst.ctx.beginPath();
        inst.ctx.arc(inst.cx, inst.cy, 80 * SCALE, 2 * Math.PI, false);
        gradient = inst.ctx.createLinearGradient(inst.cx, inst.cy, 30, 30);
        gradient.addColorStop(0, '#99547C');
        gradient.addColorStop(1, '#fff');
        inst.ctx.fillStyle = gradient;
        inst.ctx.fill();
        inst.ctx.lineWidth = 5 * SCALE;
        inst.ctx.strokeStyle = '#693A55';
        inst.ctx.stroke();

        // text
        inst.ctx.font = (30 * SCALE).toString() + 'pt helvetica';
        inst.ctx.textAlign = 'center';
        inst.ctx.fillStyle = '#fff';
        inst.ctx.fillText('Click to Start', inst.cx, inst.cy + 150 * SCALE);

        inst.canvas.addEventListener('click', inst.onClick, false);
        inst.canvas.addEventListener('contextmenu', inst.onContextMenu, false);

        return inst; 
    };

    /**
     * Game Loop
     * @returns {object} Returns game instance.
     */
    inst.game = function() {
        // init game vars
        inst.onGame = true;
        inst.onPause = false;
        inst.score = 0;
        inst.levelStartTime = new Date();
        inst.lastUpdateTime = new Date();
        inst.randomObjects = [];
        inst.guard.x = inst.cx;
        inst.guard.y = inst.cy;
        inst.guard.shield = lvl[inst.level].guard.shield;
        inst.starship.x = inst.cx - (inst.starship.width / 2);
        inst.starship.y = inst.cy - (inst.starship.height / 2);
        inst.starship.shield = lvl[inst.level].starship.shield;

        // create commets
        inst.commets = [];
        for (var i = 0; i < 10; i++) {
            inst.commets.push(new Commet(inst));
            inst.commets[i].position();
        }

        // add event listeners
        inst.canvas.addEventListener('keyup', inst.onKeyUp);
        inst.canvas.addEventListener('mousemove', inst.onMouseMove);
        inst.canvas.addEventListener('mouseout', inst.onMouseOut);
        inst.canvas.style['cursor'] = 'none';

        // game loop
        inst.loop();

        return inst;
    };
    
    inst.drawBackground = function() {
        // space
        inst.cx = inst.canvas.width / 2;
        inst.cy = inst.canvas.height / 2; 
        inst.ctx.rect(0, 0, inst.canvas.width, inst.canvas.height);
        var gradient = inst.ctx.createRadialGradient(inst.cx, inst.cy, 400 * SCALE, inst.cx, inst.cy, 100);
        gradient.addColorStop(1, '#000');
        gradient.addColorStop(0, '#222');
        inst.ctx.fillStyle = gradient;
        inst.ctx.fill();

        // starship
        inst.ctx.beginPath();
        inst.ctx.rect(inst.starship.x, inst.starship.y, inst.starship.width, inst.starship.width);
        inst.ctx.fillStyle = '#C43355';
        inst.ctx.strokeStyle = '#7D283C';
        inst.ctx.lineWidth = 5 * SCALE;
        inst.ctx.fill();
        inst.ctx.stroke();
        inst.ctx.beginPath();
        inst.ctx.rect(inst.starship.x + (inst.starship.width / 2), inst.starship.x - (inst.starship.height / 2), inst.starship.width / 2, inst.starship.height / 2);
        inst.ctx.fillStyle = '#D94C6D';
        inst.ctx.strokeStyle = '#7D283C';
        inst.ctx.lineWidth = 5 * SCALE;
        inst.ctx.fill();
        inst.ctx.stroke();
    };

    inst.drawObjects = function() {
        // guard
        inst.ctx.beginPath();
        inst.ctx.rect(inst.guard.x - 15 * SCALE, inst.guard.y - 15 * SCALE, 30 * SCALE, 30 * SCALE);
        inst.ctx.fillStyle = 'yellow';
        inst.ctx.fill();

        // commets
        inst.commets.forEach(function(commet) {
            commet.draw();
            if (inst.collides(commet, inst.guard)) {
                commet.destroyed = true;
                inst.guard.shield -= commet.damage / 4; // quarter damage for the shield
                inst.score += COMMET_SCORE; // fixed value  
            }
            
            if (inst.collides(commet, inst.starship)) {
                commet.destroyed = true;
                inst.starship.shield -= commet.damage;  
            }
            
            if (commet.destroyed) { // remove it from the array
                var index = inst.commets.indexOf(commet);
                if (index > -1) inst.commets.splice(index, 1);
            }
        });
        
        // create objects
        var rand = Math.floor(Math.random() * 1000) + 1;
        if (rand >= lvl[inst.level].commet.creationStep) {
            var commet = new Commet(inst);
            commet.position();
            inst.commets.push(commet);
        }
    };
    
    inst.drawRandomStuff = function() {
        var rand = Math.round(Math.random() * 1000) + 1;
        
        // Create Bomb
        if (rand >= lvl[inst.level].bomb.creationStep) {
            inst.randomObjects.push(new Bomb(inst));
        }
        
        // Create Guard Shield
        if (rand >= lvl[inst.level].guardShield.creationStep) {
            inst.randomObjects.push(new GuardShield(inst));
        }
        
        // Create Starship Shield
        if (rand >= lvl[inst.level].starshipShield.creationStep) {
            inst.randomObjects.push(new StarshipShield(inst));   
        }
        
        // Draw & Check Collision
        inst.randomObjects.forEach(function(obj) {
            inst.ctx.fillStyle = obj.color;
            inst.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

            if (inst.collides(obj, inst.guard)) {
                obj.trigger();    
            }
            
            if (obj.destroyed) {
                var index = inst.randomObjects.indexOf(obj);
                if (index > -1) inst.randomObjects.splice(index, 1);
            }
        });
    };

    inst.pause = function() {
        inst.ctx.fillStyle = 'black';
        inst.ctx.fillRect(0, 0, inst.canvas.width * SCALE, inst.canvas.height * SCALE);
        inst.ctx.fillStyle = 'white';
        inst.ctx.font = '24pt Arial';
        inst.ctx.textAlign = 'center';
        inst.ctx.fillText('Paused!', inst.canvas.width * SCALE / 2, inst.canvas.height * SCALE / 2);
        inst.ctx.font = '14pt Arial';
        inst.ctx.fontStyle = '#EEE';
        inst.ctx.fillText('Click the right mouse button to continue.', inst.canvas.width * SCALE / 2, inst.canvas.height * SCALE / 2 + 30);

        if (!inst.onPause) {
            inst.canvas.style['cursor'] = 'none';
            inst.loop();
            return;
        }
        requestAnimationFrame(inst.pause, inst.canvas);
    };

    inst.loop = function() {
        if (inst.onPause) {
            inst.canvas.style['cursor'] = 'default';
            inst.pause();
            return;
        }

        if (!inst.onGame)  {
            inst.clearEventListeners();
            inst.onPause = false;
            inst.load(); // reset the game
            return;
        }

        if (inst.datediff(new Date(), inst.lastUpdateTime).ms > inst.frameUpdateTime) {
            inst.drawBackground();
            inst.drawRandomStuff();
            inst.drawObjects(); 
            inst.drawStats();
            inst.lastUpdateTime = new Date();
        }            
        
        if (inst.guard.shield <= 0 || inst.starship.shield <= 0) {
            inst.onGame = false;
            console.log('shield destroyed', inst.guard.shield, inst.starship.shield);
        }
        
        if (inst.datediff(new Date(), inst.levelStartTime).minutes > lvl[inst.level].time) {
            inst.onGame = false;
            inst.level++;
            console.log('level completed - time is over - player survived');
        }

        requestAnimationFrame(inst.loop, inst.canvas);
    };

    inst.clearEventListeners = function() {
        inst.canvas.removeEventListener('click', inst.onClick, false);
        inst.canvas.removeEventListener('contextmenu', inst.onContextMenu, false);
        inst.canvas.removeEventListener('mousemove', inst.onMouseMove, false);
        inst.canvas.removeEventListener('mouseout', inst.onMouseOut, false);
        inst.canvas.removeEventListener('keyup', inst.onKeyUp, false);
    };

    inst.onMouseMove = function(e) {
        inst.guard.x = (e.x - inst.canvas.offsetLeft) * SCALE;
        inst.guard.y = (e.y - inst.canvas.offsetTop) * SCALE;
    };

    inst.onMouseOut = function(e) {
        inst.onPause = true;
    };

    inst.onClick = function(e) {
        if (!inst.onGame && !inst.onPause) inst.game();
    };

    inst.onKeyUp = function(e) {
        if (e.keyCode == KEY_ESCAPE && !inst.onPause) inst.onGame = false;
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

    inst.drawStats = function() {
        var time = inst.datediff(new Date(), inst.levelStartTime);
        var minutes = (time.minutes < 10) ? '0' + time.minutes : time.minutes;
        var seconds = (time.seconds < 10) ? '0' + time.seconds : time.seconds;

        inst.ctx.textAlign = 'left';
        inst.ctx.font = 12 * SCALE + 'pt Arial';
        inst.ctx.fillStyle = '#5CFF8F';

        inst.ctx.fillText('Score ' + inst.score, 20 * SCALE, 30 * SCALE); // score
        inst.ctx.fillText('Guard ' + inst.guard.shield + '%', 20 * SCALE, 50 * SCALE); // guard
        inst.ctx.fillText('Starship ' + inst.starship.shield + '%', 20 * SCALE, 70 * SCALE); // starship
        inst.ctx.fillText('Time ' + minutes + ':' + seconds, 20 * SCALE, 90 * SCALE); // time
    }
};

/**
 * (OBJECT) Handles the commets animation.
 * @param {object} sg SpaceGuard game instance.
 */
var Commet = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.x;
    inst.y;
    inst.width = 15 * SCALE;
    inst.height = 15 * SCALE;
    inst.speed = lvl[inst.sg.level].commet.speed;
    inst.damage = Math.floor(Math.random() * lvl[inst.sg.level].commet.damage);
    inst.dfs = 30 * SCALE; // initial distance from scene
    inst.dir;
    inst.destroyed = false;
    
    inst.position = function() {
        var canvasSide = Math.ceil(Math.random() * 4);

        switch(canvasSide) {
            case 1: // top
                inst.y = -1 * inst.dfs;
                inst.x = Math.ceil(Math.random() * sg.canvas.width);
                inst.dir = 1;
                break;
            case 2: // right
                inst.x = sg.canvas.width + inst.dfs;
                inst.y = Math.ceil(Math.random() * sg.canvas.height);
                inst.dir = -1;
                break;
            case 3:  // bottom
                inst.y = sg.canvas.height + inst.dfs;
                inst.x =  Math.ceil(Math.random() * sg.canvas.width);
                inst.dir = -1;
                break;
            case 4: // left
                inst.x = -1 * inst.dfs;
                inst.y = Math.ceil(Math.random() * sg.canvas.height);
                inst.dir = 1;
        }
    };

    inst.draw = function() {
        // move
        inst.x += inst.dir * Math.ceil(Math.random() * inst.speed) + 1;
        inst.y += inst.dir * Math.ceil(Math.random() * inst.speed) + 1;
        
        // draw
        inst.sg.ctx.beginPath();
        inst.sg.ctx.rect(inst.x, inst.y, inst.width, inst.height);
        inst.sg.ctx.fillStyle = 'red';
        inst.sg.ctx.fill();
    };
};

/**
 * (RANDOM OBJECT) Guard shield power up. 
 * @param {object} sg SpaceGuard game instance.
 */
var GuardShield = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.color = '#36BDEB';
    inst.destroyed = false;
    inst.x = Math.round(Math.random() * inst.sg.canvas.width * SCALE);
    inst.y = Math.round(Math.random() * inst.sg.canvas.height * SCALE);
    inst.width = 12 * SCALE;
    inst.height = 12 * SCALE;
    inst.shield = 10; // base power up value
    inst.value = Math.round(Math.random() * inst.shield) + inst.shield;

    inst.trigger = function() {
        inst.sg.guard.shield += inst.value;
        inst.sg.score += SHIELD_SCORE;
        inst.destroyed = true;
    }
}

/**
 * (RANDOM OBJECT) Starship shield power up. 
 * @param {object} sg SpaceGuard game instance.
 */
var StarshipShield = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.color = '#36EB57';
    inst.x = Math.round(Math.random() * inst.sg.canvas.width * SCALE);
    inst.y = Math.round(Math.random() * inst.sg.canvas.height * SCALE);
    inst.width = 12 * SCALE;
    inst.height = 12 * SCALE;
    inst.shield = 10; // base power up value
    inst.value = Math.round(Math.random() * inst.shield) + inst.shield;

    inst.trigger = function() {
        inst.sg.starship.shield += inst.value;
        inst.sg.score += SHIELD_SCORE;
        inst.destroyed = true;
    }
}

/**
 * (RANDOM OBJECT) Bomb that explodes when the guard collides with it.
 * @param {object} sg SpaceGuard game instance.
 */
var Bomb = function(sg) {
    var inst = this;
    inst.sg = sg;
    inst.color = '#6C17AD';
    inst.x = Math.round(Math.random() * inst.sg.canvas.width * SCALE);
    inst.y = Math.round(Math.random() * inst.sg.canvas.height * SCALE);
    inst.width = 12 * SCALE;
    inst.height = 12 * SCALE;
    inst.damage = 10; // base power up value
    inst.value = Math.round(Math.random() * inst.damage) + inst.damage;

    inst.trigger = function() {
        inst.sg.guard.shield -= inst.value;
        inst.destroyed = true;
    }
}

// Level Definition
var lvl = [
    {
        time: 2,
        background: 'img-path',
        guard: {
            shield: 100
        },
        starship: {
            shield: 100
        },
        commet: {
            speed: 4 * SCALE,
            damage: 2,
            creationStep: 850  // if higher less will be created
        },
        bomb: {
            creationStep: 980
        },
        guardShield: {
            creationStep: 980
        },
        starshipShield: {
            creationStep: 980
        }
    }
];

// Define global SpaceGuard object.
var sg = new SpaceGuard();