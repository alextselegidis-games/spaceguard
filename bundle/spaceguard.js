/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requestAnimFrame = requestAnimFrame;
// Cross Browser requestAnimationFrame compatibility.
// @link http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
function requestAnimFrame() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}

// Check user agent device type.
// @link http://stackoverflow.com/a/16755700/1718162
var Environment = exports.Environment = {
    //mobile or desktop compatible event name, to be used with '.on' function
    TOUCH_DOWN_EVENT_NAME: 'mousedown touchstart',
    TOUCH_UP_EVENT_NAME: 'mouseup touchend',
    TOUCH_MOVE_EVENT_NAME: 'mousemove touchmove',
    TOUCH_DOUBLE_TAB_EVENT_NAME: 'dblclick dbltap',

    isAndroid: function isAndroid() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function isBlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isIOS: function isIOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera: function isOpera() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows: function isWindows() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    isMobile: function isMobile() {
        return Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS() || Environment.isOpera() || Environment.isWindows();
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _SpaceGuard = __webpack_require__(2);

var _SpaceGuard2 = _interopRequireDefault(_SpaceGuard);

var _Environment = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.requestAnimFrame = _Environment.requestAnimFrame;

var game = new _SpaceGuard2.default();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SpaceGuard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = __webpack_require__(3);

var _Environment = __webpack_require__(0);

var _Comet = __webpack_require__(4);

var _Bomb = __webpack_require__(5);

var _StarshipShield = __webpack_require__(6);

var _GameSprites = __webpack_require__(7);

var _GuardShield = __webpack_require__(8);

var _Sprites = __webpack_require__(9);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Main game class
 */
var SpaceGuard = exports.SpaceGuard = function () {
    function SpaceGuard() {
        _classCallCheck(this, SpaceGuard);

        this.canvas;
        this.ctx;
        this.cx; // center x & y
        this.cy;
        this.guard = {
            x: undefined,
            y: undefined,
            width: 50 * _Constants.SCALE,
            height: 50 * _Constants.SCALE,
            shield: 100,
            defuseRadius: 50
        };
        this.starship = {
            x: undefined,
            y: undefined,
            width: 135 * _Constants.SCALE,
            height: 135 * _Constants.SCALE,
            shield: 100
        };
        this.sprites = {};
        this.comets;
        this.frameUpdateTime = 1000 / 60; // 60 fps
        this.lastUpdateTime; // last time canvas was updated
        this.levelStartTime; // level start time - the player needs to survive for some minutes until the level is finished
        this.pauseTime; // Stores the paused time period.
        this.randomRollTime = 3000;
        this.lastRollTime = new Date();
        this.level = 0; // level let starts from 0, not from 1 (due to array index base)
        this.score = 0;
        this.randomObjects = [];
        this.onDefuse = false;
        this.currentDefuseRadius = 0; // used for graphic display
        this.spaceBackground;
    }

    /**
     * The game must start with this method.
     *
     * @param {string} canvasId Canvas DOM element.
     * @returns {object} Returns game instance.
     */


    _createClass(SpaceGuard, [{
        key: 'initialize',
        value: function initialize(canvasId) {
            var _this = this;

            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');

            // load image sprites
            _GameSprites.GameSprites.forEach(function (sprite) {
                // let sprite = GameSprites[i];
                var img = document.createElement('img');
                img.id = sprite.id;
                img.src = sprite.src;
                img.style.display = 'none';
                document.body.appendChild(img);
                _this.sprites[sprite.id] = img; // store the element handle for later use

                // draw main screen when the images are finished loading
                if (img.id == 'introScreen' && !_Environment.Environment.isMobile()) {
                    img.onload = function () {
                        _this.drawIntroScreen();
                    };
                }
            });

            this.load();
            return this;
        }
    }, {
        key: 'load',


        /**
         * Loads needed resource files - display initial screen to user.
         *
         * @returns {object} Returns game instance.
         */
        value: function load() {
            // init canvas
            this.canvas.width = _Constants.CANVAS_WIDTH * _Constants.SCALE;
            this.canvas.height = _Constants.CANVAS_HEIGHT * _Constants.SCALE;
            this.canvas.style.background = '#000';
            this.cx = this.canvas.width / 2;
            this.cy = this.canvas.height / 2;
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

            // Check if user agent is a mobile device.
            if (_Environment.Environment.isMobile()) {
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.canvas.width * _Constants.SCALE, this.canvas.height * _Constants.SCALE);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '14pt Arial';
                this.ctx.textAlign = 'center';
                this.wrapText('Unfortunately SpaceGuard cannot be played on mobile devices. Please try again from a desktop computer.', this.canvas.width / 2 * _Constants.SCALE, this.canvas.height / 2 * _Constants.SCALE, 350 * _Constants.SCALE, 25 * _Constants.SCALE);
                return;
            }

            this.drawIntroScreen();

            // events
            this.canvas.addEventListener('click', this.onClick, false);
            this.canvas.addEventListener('contextmenu', this.onContextMenu, false);

            return this;
        }
    }, {
        key: 'game',


        /**
         * Start game - handles main loop
         * @returns {object} Returns game instance.
         */
        value: function game() {
            var _this2 = this;

            // init game lets
            this.onGame = true;
            this.onPause = false;
            this.levelStartTime = new Date();
            this.lastUpdateTime = new Date();
            this.randomObjects = [];
            this.guard.x = this.cx;
            this.guard.y = this.cy;
            this.guard.shield = GameLevels[this.level].guard.shield;
            this.guard.defuseRadius = GameLevels[this.level].guard.defuseRadius;
            this.guard.img = document.getElementById('guard');
            this.starship.x = this.cx - this.starship.width / 2;
            this.starship.y = this.cy - this.starship.height / 2;
            this.starship.shield = GameLevels[this.level].starship.shield;
            this.starship.img = document.getElementById('starship');

            // create comets
            this.comets = [];
            for (var i = 0; i < 10; i++) {
                this.comets.push(new _Comet.Comet(this));
                this.comets[i].position();
            }

            // add event listeners
            this.canvas.addEventListener('keyup', this.onKeyUp);
            this.canvas.addEventListener('mousemove', this.onMouseMove);
            this.canvas.addEventListener('mouseout', this.onMouseOut);
            this.canvas.style['cursor'] = 'none';

            // splash screen
            this.splash('Level ' + (this.level + 1), 1000, function () {
                requestAnimFrame(_this2.loop);
            });

            return this;
        }
    }, {
        key: 'drawBackground',
        value: function drawBackground() {
            // clear stuff
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // starship
            this.ctx.drawImage(this.sprites.starship, this.starship.x * _Constants.SCALE, this.starship.y * _Constants.SCALE);
        }
    }, {
        key: 'drawObjects',
        value: function drawObjects() {
            var _this3 = this;

            // guard
            this.ctx.drawImage(this.sprites.guard, this.guard.x * _Constants.SCALE, this.guard.y * _Constants.SCALE);

            if (this.onDefuse) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#57BCFF';
                this.ctx.lineWidth = 2;
                this.ctx.arc(this.guard.x + 25, this.guard.y + 25, this.currentDefuseRadius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }

            // comets
            this.comets.forEach(function (comet) {
                comet.draw();
                if (_this3.collides(comet, _this3.guard)) {
                    comet.destroyed = true;
                    _this3.guard.shield -= Math.ceil(comet.damage / 4); // quarter damage for the shield
                    _this3.score += _Constants.COMET_SCORE; // fixed value  
                }

                if (_this3.collides(comet, _this3.starship)) {
                    comet.destroyed = true;
                    _this3.starship.shield -= comet.damage;
                }

                if (comet.destroyed) {
                    // remove it from the array
                    var index = _this3.comets.indexOf(comet);
                    if (index > -1) _this3.comets.splice(index, 1);
                }
            });

            // When the level starts there is a creation barrier that will 
            // slowly fade
            var time = this.datediff(new Date(), this.levelStartTime).ms;
            creationBarrier = time < _Constants.CREATION_BARRIER_STEP ? (_Constants.CREATION_BARRIER_STEP - time) / 10 : 0;

            // When the level is about to end then we need to stop once again
            // the creation of new comets
            if (time > _Constants.CREATION_BARRIER_STEP && GameLevels[this.level].time * 60 * 1000 - time < _Constants.CREATION_BARRIER_STEP) {
                creationBarrier = (_Constants.CREATION_BARRIER_STEP - (GameLevels[this.level].time * 60 * 1000 - time)) / 10;
                if (creationBarrier > _Constants.CREATION_BARRIER_STEP) creationBarrier = _Constants.CREATION_BARRIER_STEP;
            }

            // create objects
            var rand = Math.ceil(Math.random() * 1000) - creationBarrier;
            if (rand >= this.convertRate(GameLevels[this.level].comet.creationRate)) {
                var comet = new _Comet.Comet(this);
                comet.position();
                this.comets.push(comet);
            }
        }
    }, {
        key: 'drawRandomObjects',
        value: function drawRandomObjects() {
            var _this4 = this;

            var roll = this.datediff(new Date(), this.lastRollTime).ms > this.randomRollTime;
            var creation = false; // creation flag - we need only one creation at a time
            if (roll) this.lastRollTime = new Date();

            // Create Bomb
            rand = Math.round(Math.random() * 1000) + 1;
            if (rand >= this.convertRate(GameLevels[this.level].bomb.creationRate) && roll) {
                this.randomObjects.push(new _Bomb.Bomb(this));
                creation = true;
            }

            // Create Guard Shield
            rand = Math.round(Math.random() * 1000) + 1;
            if (rand >= this.convertRate(GameLevels[this.level].guardShield.creationRate) && roll && !creation) {
                this.randomObjects.push(new _GuardShield.GuardShield(this));
                creation = true;
            }

            // Create Starship Shield
            rand = Math.round(Math.random() * 1000) + 1;
            if (rand >= this.convertRate(GameLevels[this.level].starshipShield.creationRate) && roll && !creation) {
                this.randomObjects.push(new _StarshipShield.StarshipShield(this));
                creation = true;
            }

            // Draw & Check Collision
            this.randomObjects.forEach(function (obj) {
                switch (obj.type) {
                    case _Constants.OBJ_TYPE_BOMB:
                        _this4.ctx.drawImage(_this4.sprites.bomb, obj.x, obj.y);
                        break;
                    case _Constants.OBJ_TYPE_GSHIELD:
                        _this4.ctx.drawImage(_this4.sprites.gshield, obj.x, obj.y);
                        break;
                    case _Constants.OBJ_TYPE_SSHIELD:
                        _this4.ctx.drawImage(_this4.sprites.sshield, obj.x, obj.y);
                        break;
                }

                if (_this4.collides(obj, _this4.guard)) obj.trigger();

                if (obj.destroyed) {
                    var index = _this4.randomObjects.indexOf(obj);
                    if (index > -1) _this4.randomObjects.splice(index, 1);
                }
            });
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width * _Constants.SCALE, this.canvas.height * _Constants.SCALE);
            this.drawCredits();
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24pt Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Paused!', this.canvas.width * _Constants.SCALE / 2, this.canvas.height * _Constants.SCALE / 2);
            this.ctx.font = '14pt Arial';
            this.ctx.fontStyle = '#EEE';
            this.ctx.fillText('Click the right mouse button to continue.', this.canvas.width * _Constants.SCALE / 2, this.canvas.height * _Constants.SCALE / 2 + 30);
            this.drawStats(true);

            if (!this.onPause) {
                this.canvas.style['cursor'] = 'none';
                var diff = new Date() - this.pauseTime;
                this.levelStartTime.setMilliseconds(diff);
                this.loop();
                return;
            }
            requestAnimFrame(this.pause, this.canvas);
        }
    }, {
        key: 'loop',
        value: function loop() {
            var message = void 0,
                callback = void 0,
                duration = void 0;

            if (this.onPause) {
                this.canvas.style['cursor'] = 'default';
                this.pauseTime = new Date();
                this.pause();
                return;
            }

            if (!this.onGame) return;

            if (this.datediff(new Date(), this.lastUpdateTime).ms > this.frameUpdateTime) {
                this.drawBackground();
                this.drawCredits();
                this.drawRandomObjects();
                this.drawObjects();
                this.drawStats();
                this.lastUpdateTime = new Date();
            }

            if (this.guard.shield <= 0 || this.starship.shield <= 0) {
                // reset game - game over
                this.onGame = false;
                this.onPause = false;
                //this.level = 0; 
                this.clearEventListeners();
                message = (this.guard.shield <= 0 ? 'Guard Destroyed!' : 'Starship Destroyed!') + ' Score ' + this.score + ' (-50%)';
                this.splash(message, 2000, this.load);
                this.score = this.score > 0 ? Math.round(this.score / 2) : 0; // if the player is destroyed he'll just lose half of his score
                return;
            }

            if (this.datediff(new Date(), this.levelStartTime).ms > GameLevels[this.level].time * 60 * 1000) {
                this.onGame = false;
                this.onPause = false;

                if (this.level < GameLevels.length) {
                    message = 'Level Completed!';
                    callback = this.game;
                    duration = 2000;
                    this.level++;
                } else {
                    message = 'Congrats! You\'ve Completed All Game Levels - Score ' + this.score;
                    callback = this.load;
                    duration = 5000;
                    this.level = 0;
                }

                this.splash(message, duration, callback);
                return;
            }

            requestAnimFrame(this.loop, this.canvas);
        }
    }, {
        key: 'clearEventListeners',
        value: function clearEventListeners() {
            this.canvas.removeEventListener('click', this.onClick, false);
            this.canvas.removeEventListener('contextmenu', this.onContextMenu, false);
            this.canvas.removeEventListener('mousemove', this.onMouseMove, false);
            this.canvas.removeEventListener('mouseout', this.onMouseOut, false);
            this.canvas.removeEventListener('keyup', this.onKeyUp, false);
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            this.guard.x = (e.pageX - this.canvas.offsetLeft - 15) * _Constants.SCALE;
            this.guard.y = (e.pageY - this.canvas.offsetTop - 15) * _Constants.SCALE;
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut(event) {
            this.onPause = true;
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            if (this.onGame && !this.onPause) this.bombDefuse(); // *** must be executed before the next command!
            if (!this.onGame && !this.onPause) this.game();
        }
    }, {
        key: 'onKeyUp',
        value: function onKeyUp(event) {
            if (e.keyCode == _Constants.KEY_ESCAPE && !this.onPause) {
                this.onGame = false;
                this.onPause = false;
                // reset stuff
                this.score = 0;
                this.level = 0;
                this.clearEventListeners();
                this.splash('Game Over', 1000, this.load);
            }
        }
    }, {
        key: 'onContextMenu',
        value: function onContextMenu(event) {
            if (this.onGame && !this.onPause) this.onPause = true;else if (this.onGame && this.onPause) this.onPause = false;
            e.preventDefault();
            return false;
        }
    }, {
        key: 'datediff',
        value: function datediff(date1, date2) {
            // @link http://stackoverflow.com/a/7709819/1718162
            // @link http://stackoverflow.com/a/13894670/1718162
            var diff = {};
            diff.ms = date1 - date2;
            diff.days = Math.round(diff.ms / 86400000);
            diff.hours = Math.round(diff.ms % 86400000 / 3600000);
            diff.minutes = Math.round(diff.ms % 86400000 % 3600000 / 60000);
            diff.seconds = parseInt((date1.getTime() - date2.getTime()) / 1000);
            return diff;
        }
    }, {
        key: 'collides',


        /**
         * Check collision between objects.
         * @param {object} obj1{x, y, width, height}
         * @param {object} obj2{x, y, width, height}
         * @returns {bool}
         */
        /**
         * Check collision between objects.
         * @param {object} obj1{x, y, width, height}
         * @param {object} obj2{x, y, width, height}
         * @returns {bool}
         */
        value: function collides(obj1, obj2) {
            var x1 = void 0,
                y1 = void 0,
                w1 = void 0,
                h1 = void 0; // obj1
            var ox = void 0,
                oy = void 0,
                ow = void 0,
                oh = void 0; // obj2

            x1 = obj1.x;
            y1 = obj1.y;
            w1 = obj1.width;
            h1 = obj1.height;

            x2 = obj2.x;
            y2 = obj2.y;
            w2 = obj2.width;
            h2 = obj2.height;

            // check whether objects collide
            return (x1 < x2 && x1 + w1 > x2 || x1 > x2 && x1 + w1 < x2 + w2 || x1 > x2 && x1 < x2 + w2) && (y1 < y2 && y1 + h1 > y2 || y1 > y2 && y1 + h1 < y2 + h2 || y1 > y2 && y1 < y2 + h2) ? true : false;
        }
    }, {
        key: 'drawStats',
        value: function drawStats(onPause) {
            var currDate = !onPause ? new Date() : this.lastUpdateTime;
            var time = this.datediff(currDate, this.levelStartTime);
            var diff = new Date(GameLevels[this.level].time * 60 * 1000 - time.ms);
            var minutes = diff.getMinutes() < 10 ? '0' + diff.getMinutes() : diff.getMinutes();
            var seconds = diff.getSeconds() < 10 ? '0' + diff.getSeconds() : diff.getSeconds();

            this.ctx.textAlign = 'left';
            this.ctx.font = 12 * _Constants.SCALE + 'pt Arial';
            this.ctx.fillStyle = '#5CFF8F';

            this.ctx.fillText('Level ' + (this.level + 1), 20 * _Constants.SCALE, 30 * _Constants.SCALE);
            this.ctx.fillText('Time ' + minutes + ':' + seconds, 20 * _Constants.SCALE, 50 * _Constants.SCALE); // time
            this.ctx.fillText('Score ' + this.score, 20 * _Constants.SCALE, 70 * _Constants.SCALE); // score

            this.ctx.textAlign = 'right';
            this.ctx.lineWidth = '1';
            var gColor = this.getBarColor(this.guard.shield, onPause);
            var sColor = this.getBarColor(this.starship.shield, onPause);

            this.ctx.fillStyle = gColor;
            this.ctx.fillText('Guard ' + this.guard.shield + '%', (this.canvas.width - 20) * _Constants.SCALE, 30 * _Constants.SCALE); // guard
            this.ctx.fillStyle = sColor;
            this.ctx.fillText('Starship ' + this.starship.shield + '%', (this.canvas.width - 20) * _Constants.SCALE, 80 * _Constants.SCALE); // starship

            gColor = this.getBarColor(this.guard.shield, onPause, true);
            sColor = this.getBarColor(this.starship.shield, onPause, true);

            this.ctx.strokeStyle = gColor;
            this.ctx.strokeRect((this.canvas.width - 152) * _Constants.SCALE, 40, 130, 15);
            this.ctx.fillStyle = gColor;
            this.ctx.fillRect((this.canvas.width - 152) * _Constants.SCALE, 40, this.guard.shield / 100 * 130, 15);

            this.ctx.strokeStyle = sColor;
            this.ctx.strokeRect((this.canvas.width - 152) * _Constants.SCALE, 90, 130, 15);
            this.ctx.fillStyle = sColor;
            this.ctx.fillRect((this.canvas.width - 152) * _Constants.SCALE, 90, this.starship.shield / 100 * 130, 15);
        }
    }, {
        key: 'getBarColor',
        value: function getBarColor(value, onPause, opaque) {
            var color = void 0;

            if (value > 70) color = !onPause && opaque ? 'rgba(92, 255, 201, 0.9)' : '#5CFFC9'; // cyan
            else if (value > 40) color = !onPause && opaque ? 'rgba(92, 255, 143, 0.9)' : '#5CFF8F'; // green
                else if (value > 15) color = !onPause && opaque ? 'rgba(255, 149, 92, 0.9)' : '#FF955C'; // orange
                    else color = !onPause && opaque ? 'rgba(255, 92, 92, 0.9)' : '#FF5C5C'; // red

            return color;
        }
    }, {
        key: 'bombDefuse',


        /**
         * The guard is able to defuse nearby bomb, but this will also
         * destroy any nearby objects.
         */
        value: function bombDefuse() {
            var _this5 = this;

            if (this.onDefuse) return false;

            this.onDefuse = true;
            var defuseInterval = setInterval(function () {
                _this5.currentDefuseRadius++;
                _this5.randomObjects.forEach(function (obj) {
                    distance = Math.sqrt(Math.pow(_this5.guard.x + 15 - obj.x, 2) + Math.pow(_this5.guard.y + 15 - obj.y, 2));
                    if (distance <= _this5.currentDefuseRadius) {
                        obj.destroyed = true;
                        if (obj.type == _Constants.OBJ_TYPE_BOMB) _this5.score += _Constants.BOMB_SCORE;
                    }
                });
                if (_this5.currentDefuseRadius == _this5.guard.defuseRadius) {
                    clearInterval(defuseInterval);
                    _this5.currentDefuseRadius = 0;
                    _this5.onDefuse = false;
                }
            }, 7);
        }
    }, {
        key: 'splash',


        /**
         * Display splash screen with a custom message.
         * @param  {string}   text     The message to be displayed on the splash screen.
         * @param  {int}   duration The ammount of time that the splash screen will remain on canvas.
         * @param  {function} callback This method will be called after the splash is finished.
         */
        value: function splash(text, duration, callback) {
            var _this6 = this;

            var drawStartTime = new Date();
            var drawSplashScreen = function drawSplashScreen() {
                _this6.ctx.fillStyle = 'black';
                _this6.ctx.fillRect(0, 0, _this6.canvas.width * _Constants.SCALE, _this6.canvas.height * _Constants.SCALE);
                _this6.ctx.fillStyle = 'white';
                _this6.ctx.font = '24pt Arial';
                _this6.ctx.textAlign = 'center';
                _this6.ctx.fillText(text, _this6.canvas.width * _Constants.SCALE / 2, _this6.canvas.height * _Constants.SCALE / 2);

                if (_this6.datediff(new Date(), drawStartTime).ms > duration) {
                    // end of splash screen
                    if (callback) callback();
                    return;
                }

                requestAnimFrame(drawSplashScreen, _this6.canvas);
            };
            drawSplashScreen();
        }
    }, {
        key: 'convertRate',


        /**
         * Converts the creation rate from percentage into a value that will be
         * compared with the random value.
         * @param  {int} rate Creation rate in percentage.
         * @return {int} Returns the number that is going to be compared with the random value.
         */
        value: function convertRate(rate) {
            return 1000 - rate * 10;
        }
    }, {
        key: 'drawCredits',
        value: function drawCredits() {
            this.ctx.fillStyle = '#515151';
            this.ctx.font = '8pt Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText('(C) Copyright ' + new Date().getFullYear() + ' - AlexTselegidis.Com', (this.canvas.width - 10) * _Constants.SCALE, (this.canvas.height - 10) * _Constants.SCALE);
        }
    }, {
        key: 'wrapText',


        // @link http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
        value: function wrapText(text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    this.ctx.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            this.ctx.fillText(line, x, y);
        }
    }, {
        key: 'drawIntroScreen',
        value: function drawIntroScreen() {
            // splash
            this.ctx.drawImage(this.sprites.introScreen, 1, 1);

            // text
            this.ctx.font = (30 * _Constants.SCALE).toString() + 'pt helvetica';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText('SpaceGuard', this.cx, this.cy - 220 * _Constants.SCALE);
            this.ctx.font = (20 * _Constants.SCALE).toString() + 'pt helvetica';
            this.ctx.fillText('Click to Start', this.cx, this.cy + 250 * _Constants.SCALE);
            this.canvas.style['cursor'] = 'default';

            return this;
        }
    }]);

    return SpaceGuard;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Global Constants
var SCALE = exports.SCALE = 1;
var CANVAS_WIDTH = exports.CANVAS_WIDTH = 800; // px
var CANVAS_HEIGHT = exports.CANVAS_HEIGHT = 600; // px
var KEY_ESCAPE = exports.KEY_ESCAPE = 27;
var LOOP_DELAY = exports.LOOP_DELAY = 10;
var GUARD_SHIELD_BASE = exports.GUARD_SHIELD_BASE = 10;
var STARSHIP_SHIELD_BASE = exports.STARSHIP_SHIELD_BASE = 10;
var COMET_SCORE = exports.COMET_SCORE = 5;
var SHIELD_SCORE = exports.SHIELD_SCORE = 3;
var BOMB_SCORE = exports.BOMB_SCORE = 5;
var LEVEL_SCORE = exports.LEVEL_SCORE = 100;
var CREATION_BARRIER_STEP = exports.CREATION_BARRIER_STEP = 5000;
var OBJ_TYPE_BOMB = exports.OBJ_TYPE_BOMB = 'bomb';
var OBJ_TYPE_GSHIELD = exports.OBJ_TYPE_GSHIELD = 'gshield';
var OBJ_TYPE_SSHIELD = exports.OBJ_TYPE_SSHIELD = 'sshield';

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * (OBJECT) Handles the comets animation.
 * @param {object} sg SpaceGuard game instance.
 */
var Comet = exports.Comet = function Comet(sg) {
    this.sg = sg;
    this.x;
    this.y;
    this.a; // extra direction handling
    this.width = 60 * SCALE;
    this.height = 60 * SCALE;
    this.speedX = GameLevels[this.sg.level].comet.speed * Math.random();
    this.speedY = GameLevels[this.sg.level].comet.speed * Math.random();
    this.damage = Math.floor(Math.random() * GameLevels[this.sg.level].comet.damage);
    this.dfs = 30 * SCALE; // initial distance from scene
    this.destroyed = false;

    this.position = function () {
        var canvasSide = Math.ceil(Math.random() * 4);

        switch (canvasSide) {
            case 1:
                // top
                this.y = -1 * this.dfs;
                this.x = Math.ceil(Math.random() * sg.canvas.width);
                if (this.x > this.sg.canvas.width / 2) this.speedX = -1 * this.speedX;
                this.speedY = -1 * this.speedY;
                break;
            case 2:
                // right
                this.x = sg.canvas.width + this.dfs;
                this.y = Math.ceil(Math.random() * sg.canvas.height);
                if (this.y > this.sg.canvas.height / 2) this.speedY = -1 * this.speedY;
                this.speedX = -1 * this.speedX;
                break;
            case 3:
                // bottom
                this.y = sg.canvas.height + this.dfs;
                this.x = Math.ceil(Math.random() * sg.canvas.width);
                if (this.x > this.sg.canvas.width / 2) this.speedX = -1 * this.speedX;
                break;
            case 4:
                // left
                this.x = -1 * this.dfs;
                this.y = Math.ceil(Math.random() * sg.canvas.height);
                if (this.y > this.sg.canvas.height / 2) this.speedY = -1 * this.speedY;
        }

        this.a = Math.random() * 1;
    };

    this.draw = function () {
        // move
        this.x += this.a * Math.ceil(Math.random() * this.speedX) + Math.round(this.speedX / 2);
        this.y += this.a * Math.ceil(Math.random() * this.speedY) + Math.round(this.speedY / 2);

        // check if comet is out of map
        this.isOutOfMap();

        // draw
        this.sg.ctx.drawImage(this.sg.sprites.comet, this.x, this.y);
    };

    this.isOutOfMap = function () {
        // if the comet is too far from the map frame it means that
        // it needs to be destroyed cause it will no longer play any
        // part on the game
        var dist = Math.abs(Math.sqrt(Math.pow(this.x - this.sg.cx, 2) + Math.pow(this.y - this.sg.cy, 2)));
        if (dist > this.sg.canvas.width) this.destroyed = true;
    };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * (RANDOM OBJECT) Bomb that explodes when the guard collides with it.
 * @param {object} sg SpaceGuard game instance.
 */
var Bomb = exports.Bomb = function Bomb(sg) {
    this.sg = sg;
    this.type = OBJ_TYPE_BOMB;
    this.color = '#6C17AD';
    this.x = Math.round(Math.random() * this.sg.canvas.width * SCALE);
    this.y = Math.round(Math.random() * this.sg.canvas.height * SCALE);
    this.width = 30 * SCALE;
    this.height = 30 * SCALE;
    this.damage = 20; // base damage value
    this.value = Math.ceil(Math.random() * this.damage) + this.damage;

    this.trigger = function () {
        this.sg.guard.shield -= this.value;
        this.destroyed = true;
    };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * (RANDOM OBJECT) Starship shield power up.
 * @param {object} sg SpaceGuard game instance.
 */
var StarshipShield = exports.StarshipShield = function StarshipShield(sg) {
    this.sg = sg;
    this.type = OBJ_TYPE_SSHIELD;
    this.color = '#36EB57';
    this.x = Math.round(Math.random() * this.sg.canvas.width * SCALE);
    this.y = Math.round(Math.random() * this.sg.canvas.height * SCALE);
    this.width = 30 * SCALE;
    this.height = 30 * SCALE;
    this.shield = 10; // base power up value
    this.value = Math.round(Math.random() * this.shield) + this.shield;

    this.trigger = function () {
        this.sg.starship.shield += this.value;
        if (this.sg.starship.shield > GameLevels[this.sg.level].starship.shield) this.sg.starship.shield = GameLevels[this.sg.level].starship.shield;
        this.sg.score += SHIELD_SCORE;
        this.destroyed = true;
    };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Sprites Definition
 *
 * All the game sprites are loaded dynamically by this script. Just
 * add a new item on the array.
 *
 * @type {Array}
 */
var GameSprites = exports.GameSprites = [{
    id: 'guard',
    src: 'images/guard.png'
}, {
    id: 'comet',
    src: 'images/comet.png'
}, {
    id: 'bomb',
    src: 'images/bomb.png'
}, {
    id: 'gshield',
    src: 'images/gshield.png'
}, {
    id: 'sshield',
    src: 'images/sshield.png'
}, {
    id: 'starship',
    src: 'images/starship.png'
}, {
    id: 'introScreen',
    src: 'images/introScreen.png'
}];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * (RANDOM OBJECT) Guard shield power up.
 * @param {object} sg SpaceGuard game instance.
 */
var GuardShield = exports.GuardShield = function GuardShield(sg) {
    this.sg = sg;
    this.type = OBJ_TYPE_GSHIELD;
    this.color = '#36BDEB';
    this.destroyed = false;
    this.x = Math.round(Math.random() * this.sg.canvas.width * SCALE);
    this.y = Math.round(Math.random() * this.sg.canvas.height * SCALE);
    this.width = 30 * SCALE;
    this.height = 30 * SCALE;
    this.shield = 10; // base power up value
    this.value = Math.round(Math.random() * this.shield) + this.shield;

    this.trigger = function () {
        this.sg.guard.shield += this.value;
        if (this.sg.guard.shield > GameLevels[this.sg.level].guard.shield) this.sg.guard.shield = GameLevels[this.sg.level].guard.shield;
        this.sg.score += SHIELD_SCORE;
        this.destroyed = true;
    };
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ })
/******/ ]);
//# sourceMappingURL=spaceguard.js.map