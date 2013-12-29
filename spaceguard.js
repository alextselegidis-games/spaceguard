/**
 * SpaceGuard - Simple HTML5 Browser Game
 * 
 * Initialize the global sg object with the canvas id and the game will start 
 * running automatically. More info at https://github.com/alextselegidis/SpaceGuard
 * 
 * Supported Browsers: Chrome, Firefox, Safari, Opera, IE
 */

var KEY_ESCAPE = 27;
var LOOP_DELAY = 10;

var SpaceGuard = function() {
    var inst = this;
    var canvas;
    var ctx;
    var cx, cy; // center x & y
    var guard;
    var commets;
    var loopInterval;
    
    /**
     * The game must start with this method.
     * @param {string} canvasId Canvas DOM element.
     * @returns {object} Returns game instance.
     */
    inst.initialize = function(canvasId) {
        inst.canvas = document.getElementById(canvasId);
        inst.ctx = inst.canvas.getContext('2d');
        inst.load();
        return inst;
    };
    
    /**
     * Loads needed resource files.
     * @returns {object} Returns game instance.
     */
    inst.load = function() {
        inst.listeners = [];
        
        // background
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
        inst.ctx.arc(inst.cx, inst.cy, 80, 2 * Math.PI, false);
        gradient = inst.ctx.createLinearGradient(inst.cx, inst.cy, 30, 30);
        gradient.addColorStop(0, '#99547C');
        gradient.addColorStop(1, '#fff');
        inst.ctx.fillStyle = gradient;
        inst.ctx.fill();
        inst.ctx.lineWidth = 5;
        inst.ctx.strokeStyle = '#693A55';
        inst.ctx.stroke();
        
        // text
        inst.ctx.font = '30pt helvetica';
        inst.ctx.textAlign = 'center';
        inst.ctx.fillStyle = '#fff';
        inst.ctx.fillText('Click to Start', inst.cx, inst.cy + 150);
        
        inst.canvas.addEventListener('click', inst.onClick, false);
        
        return inst; 
    };
    
    /**
     * Game Loop
     * @returns {object} Returns game instance.
     */
    inst.game = function() {
        inst.onGame = true;
        inst.onPause = false;
        inst.guard = {
            x: inst.cx, 
            y: inst.cy,
            shield: 100
        };
        inst.commets = [];

        inst.canvas.addEventListener('keyup', inst.onKeyUp);
        inst.canvas.addEventListener('mousemove', inst.onMouseMove);
        inst.canvas.addEventListener('mouseout', inst.onMouseOut);
        
        inst.canvas.style['cursor'] = 'none';
        
        inst.loopInterval = setInterval(inst.loop, LOOP_DELAY);
        
        return inst;
    };
    
    inst.drawBackground = function() {
        // space
        inst.cx = inst.canvas.width / 2;
        inst.cy = inst.canvas.height / 2; 
        inst.ctx.rect(0, 0, inst.canvas.width, inst.canvas.height);
        var gradient = inst.ctx.createRadialGradient(inst.cx, inst.cy, 400, inst.cx, inst.cy, 100);
        gradient.addColorStop(1, '#000');
        gradient.addColorStop(0, '#222');
        inst.ctx.fillStyle = gradient;
        inst.ctx.fill();
        
        // starship
        inst.ctx.beginPath();
        inst.ctx.rect(inst.cx - 50, inst.cy - 50, 100, 100);
        inst.ctx.fillStyle = '#C43355';
        inst.ctx.strokeStyle = '#7D283C';
        inst.ctx.lineWidth = 5;
        inst.ctx.fill();
        inst.ctx.stroke();
        inst.ctx.beginPath();
        inst.ctx.rect(inst.cx - 20, inst.cy - 20, 40, 40);
        inst.ctx.fillStyle = '#D94C6D';
        inst.ctx.strokeStyle = '#7D283C';
        inst.ctx.lineWidth = 5;
        inst.ctx.fill();
        inst.ctx.stroke();
        
    };
    
    inst.drawObjects = function() {
        // guard
        inst.ctx.beginPath();
        inst.ctx.rect(inst.guard.x - 15, inst.guard.y - 15, 30, 30);
        inst.ctx.fillStyle = 'yellow';
        inst.ctx.fill();
        
        // @task check collisions - each object should check for collisions
    };
    
    inst.pause = function() {
        if (!inst.onPause) {
            clearInterval(inst.loopInterval);
            inst.canvas.style['cursor'] = 'none';
            inst.loopInterval = setInterval(inst.loop, LOOP_DELAY);
        }
    };
    
    inst.loop = function() {
        if (inst.onPause) {
            clearInterval(inst.loopInterval);
            inst.canvas.style['cursor'] = 'default';
            inst.loopInterval = setInterval(inst.pause, LOOP_DELAY);
            return;
        }

        if (!inst.onGame)  {
            clearInterval(inst.loopInterval);
            inst.clearEventListeners();
            inst.onPause = false;
            inst.load(); // reset the game
            return;
        }

        inst.drawBackground();
        inst.drawObjects();
    };
    
    inst.clearEventListeners = function() {
        inst.canvas.removeEventListener('click', inst.click, false);
        inst.canvas.removeEventListener('mousemove', inst.onMouseMove, false);
        inst.canvas.removeEventListener('mouseout', inst.onMouseOut, false);
        inst.canvas.removeEventListener('keyup', inst.onKeyUp, false);
    };
    
    inst.onMouseMove = function(e) {
        inst.guard.x = e.x;
        inst.guard.y = e.y;
    };
    
    inst.onMouseOut = function(e) {
        inst.onPause = true;
    };
    
    inst.onClick = function(e) {
        if (!inst.onGame && !inst.onPause) inst.game();
        else if (inst.onGame && !inst.onPause) inst.onPause = true;
        else if (inst.onGame && inst.onPause) inst.onPause = false;
    };
    
    inst.onKeyUp = function(e) {
        if (e.keyCode == KEY_ESCAPE) inst.onGame = false;
    };
};

// @task Implement commet object class
var Commet = function() {
    var inst = this;
    var x;
    var y;
    var speed;
    
};

// Define global SpaceGuard object.
var sg = new SpaceGuard();