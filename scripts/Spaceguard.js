/* ----------------------------------------------------------------------------
 * Spaceguard - Arcade Space Game written in JavaScript
 *
 * @package     Spaceguard
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://alextselegidis.com/spaceguard
 * ---------------------------------------------------------------------------- */

import {
    SCALE,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    KEY_ESCAPE,
    COMET_SCORE,
    BOMB_SCORE,
    CREATION_BARRIER_STEP,
    OBJ_TYPE_BOMB,
    OBJ_TYPE_GSHIELD,
    OBJ_TYPE_SSHIELD
} from './Constants';
import Environment from './Environment';
import Sprites from './Sprites';
import Levels from './Levels';
import Comet from './Comet';
import Bomb from './Bomb';
import SpaceshipShield from './SpaceshipShield';
import GuardShield from './GuardShield';

/**
 * Spaceguard
 *
 * Main game class that handles core operations and loops.
 */
export default class Spaceguard {
    /**
     * Class constructor.
     */
    constructor() {
        this.canvas;
        this.ctx;
        this.cx; // center x & y
        this.cy;
        this.guard = {
            x: undefined,
            y: undefined,
            width: 50 * SCALE,
            height: 50 * SCALE,
            shield: 100,
            defuseRadius: 50
        };
        this.spaceship = {
            x: undefined,
            y: undefined,
            width: 135 * SCALE,
            height: 135 * SCALE,
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
     * Initialize game platform.
     *
     * @param {string} canvasId Canvas DOM element.
     *
     * @return {Object} Returns game instance.
     */
    initialize(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // load image sprites
        Sprites.forEach((sprite) => {
            // let sprite = Sprites[i];
            const img = document.createElement('img');
            img.id = sprite.id;
            img.src = sprite.src;
            img.style.display = 'none';
            document.body.appendChild(img);
            this.sprites[sprite.id] = img; // store the element handle for later use

            // draw main screen when the images are finished loading
            if (img.id === 'introScreen' && !Environment.isMobile()) {
                img.onload = () => {
                    this.drawIntroScreen();
                }
            }
        });

        this.load();
        return this;
    };

    /**
     * Load needed resource files - display initial screen to user.
     *
     * @return {Object} Returns game instance.
     */
    load() {
        // init canvas
        this.canvas.width = CANVAS_WIDTH * SCALE;
        this.canvas.height = CANVAS_HEIGHT * SCALE;
        this.canvas.style.background = '#000';
        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

        // Check if user agent is a mobile device.
        if (Environment.isMobile()) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width * SCALE, this.canvas.height * SCALE);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14pt Arial';
            this.ctx.textAlign = 'center';
            this.wrapText('Unfortunately Spaceguard cannot be played on mobile devices. Please try again from a desktop computer.',
                (this.canvas.width / 2) * SCALE, (this.canvas.height / 2) * SCALE, 350 * SCALE, 25 * SCALE);
            return;
        }

        this.drawIntroScreen();

        // events
        this.canvas.addEventListener('click', this.onClick.bind(this), false);
        this.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this), false);

        return this;
    };

    /**
     * Execute main game loop.
     *
     * @return {Object} Returns game instance.
     */
    game() {
        // init game lets
        this.onGame = true;
        this.onPause = false;
        this.levelStartTime = new Date();
        this.lastUpdateTime = new Date();
        this.randomObjects = [];
        this.guard.x = this.cx;
        this.guard.y = this.cy;
        this.guard.shield = Levels[this.level].guard.shield;
        this.guard.defuseRadius = Levels[this.level].guard.defuseRadius;
        this.guard.img = document.getElementById('guard');
        this.spaceship.x = this.cx - (this.spaceship.width / 2);
        this.spaceship.y = this.cy - (this.spaceship.height / 2);
        this.spaceship.shield = Levels[this.level].spaceship.shield;
        this.spaceship.img = document.getElementById('spaceship');

        // Create comets.
        this.comets = [];
        for (let i = 0; i < 10; i++) {
            this.comets.push(new Comet(this));
            this.comets[i].position();
        }

        // Add event listeners.
        this.canvas.addEventListener('keyup', this.onKeyUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
        this.canvas.style['cursor'] = 'none';

        // Splash screen.
        this.splash('Level ' + (this.level + 1), 1000, () => {
            requestAnimationFrame(this.loop.bind(this));
        });

        return this;
    };

    /**
     * Draw the game background.
     */
    drawBackground() {
        // Clear stuff
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Spaceship
        this.ctx.drawImage(this.sprites.spaceship, this.spaceship.x * SCALE, this.spaceship.y * SCALE);
    };

    /**
     * Draw the game objects.
     */
    drawObjects() {
        // Guard
        this.ctx.drawImage(this.sprites.guard, this.guard.x * SCALE, this.guard.y * SCALE);

        if (this.onDefuse) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#57BCFF';
            this.ctx.lineWidth = 2;
            this.ctx.arc(this.guard.x + 25, this.guard.y + 25, this.currentDefuseRadius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        // Comets
        this.comets.forEach((comet) => {
            comet.draw();
            if (this.collides(comet, this.guard)) {
                comet.destroyed = true;
                this.guard.shield -= Math.ceil(comet.damage / 4); // quarter damage for the shield
                this.score += COMET_SCORE; // fixed value  
            }

            if (this.collides(comet, this.spaceship)) {
                comet.destroyed = true;
                this.spaceship.shield -= comet.damage;
            }

            if (comet.destroyed) { // remove it from the array
                let index = this.comets.indexOf(comet);
                if (index > -1) this.comets.splice(index, 1);
            }
        });

        // When the level starts there is a creation barrier that will slowly fade.
        let time = this.datediff(new Date(), this.levelStartTime).ms;
        let creationBarrier = (time < CREATION_BARRIER_STEP) ? (CREATION_BARRIER_STEP - time) / 10 : 0;

        // When the level is about to end then we need to stop once again the creation of new comets.
        if (time > CREATION_BARRIER_STEP && (Levels[this.level].time * 60 * 1000) - time < CREATION_BARRIER_STEP) {
            creationBarrier = (CREATION_BARRIER_STEP - ((Levels[this.level].time * 60 * 1000) - time)) / 10;
            if (creationBarrier > CREATION_BARRIER_STEP) creationBarrier = CREATION_BARRIER_STEP;
        }

        // Create objects
        let rand = Math.ceil(Math.random() * 1000) - creationBarrier;
        if (rand >= this.convertRate(Levels[this.level].comet.creationRate)) {
            let comet = new Comet(this);
            comet.position();
            this.comets.push(comet);
        }
    };

    /**
     * Draw random game objects.
     */
    drawRandomObjects() {
        let roll = (this.datediff(new Date(), this.lastRollTime).ms > this.randomRollTime);
        let creation = false; // creation flag - we need only one creation at a time
        if (roll) this.lastRollTime = new Date();

        // Create Bomb
        let rand = Math.round(Math.random() * 1000) + 1;
        if (rand >= this.convertRate(Levels[this.level].bomb.creationRate) && roll) {
            this.randomObjects.push(new Bomb(this));
            creation = true;
        }

        // Create Guard Shield
        rand = Math.round(Math.random() * 1000) + 1;
        if (rand >= this.convertRate(Levels[this.level].guardShield.creationRate) && roll && !creation) {
            this.randomObjects.push(new GuardShield(this));
            creation = true;
        }

        // Create Spaceship Shield
        rand = Math.round(Math.random() * 1000) + 1;
        if (rand >= this.convertRate(Levels[this.level].spaceshipShield.creationRate) && roll && !creation) {
            this.randomObjects.push(new SpaceshipShield(this));
            creation = true;
        }

        // Draw & Check Collision
        this.randomObjects.forEach((obj) => {
            switch (obj.type) {
                case OBJ_TYPE_BOMB:
                    this.ctx.drawImage(this.sprites.bomb, obj.x, obj.y);
                    break;
                case OBJ_TYPE_GSHIELD:
                    this.ctx.drawImage(this.sprites.gshield, obj.x, obj.y);
                    break;
                case OBJ_TYPE_SSHIELD:
                    this.ctx.drawImage(this.sprites.sshield, obj.x, obj.y);
                    break;
            }

            if (this.collides(obj, this.guard))
                obj.trigger();

            if (obj.destroyed) {
                let index = this.randomObjects.indexOf(obj);
                if (index > -1) this.randomObjects.splice(index, 1);
            }
        });
    };

    /**
     * Pause the game and display the pause menu.
     */
    pause() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width * SCALE, this.canvas.height * SCALE);
        this.drawCredits();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24pt Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Paused!', this.canvas.width * SCALE / 2, this.canvas.height * SCALE / 2);
        this.ctx.font = '14pt Arial';
        this.ctx.fontStyle = '#EEE';
        this.ctx.fillText('Click the right mouse button to continue.', this.canvas.width * SCALE / 2, this.canvas.height * SCALE / 2 + 30);
        this.drawStats(true);

        if (!this.onPause) {
            this.canvas.style['cursor'] = 'none';
            let diff = new Date() - this.pauseTime;
            this.levelStartTime.setMilliseconds(diff);
            this.loop();
            return;
        }
        requestAnimationFrame(this.pause.bind(this), this.canvas);
    };

    /**
     * Handles main game loop.
     */
    loop() {
        let message;
        let callback;
        let duration;

        if (this.onPause) {
            this.canvas.style['cursor'] = 'default';
            this.pauseTime = new Date();
            this.pause();
            return;
        }

        if (!this.onGame) {
            return;
        }

        if (this.datediff(new Date(), this.lastUpdateTime).ms > this.frameUpdateTime) {
            this.drawBackground();
            this.drawCredits();
            this.drawRandomObjects();
            this.drawObjects();
            this.drawStats();
            this.lastUpdateTime = new Date();
        }

        if (this.guard.shield <= 0 || this.spaceship.shield <= 0) {
            // Reset game - game over
            this.onGame = false;
            this.onPause = false;
            //this.level = 0; 
            this.clearEventListeners();
            message = (this.guard.shield <= 0 ? 'Guard Destroyed!' : 'Spaceship Destroyed!') + ' Score ' + this.score + ' (-50%)';
            this.splash(message, 2000, this.load);
            this.score = this.score > 0 ? Math.round(this.score / 2) : 0; // if the player is destroyed he'll just lose half of his score
            return;
        }

        if (this.datediff(new Date(), this.levelStartTime).ms > Levels[this.level].time * 60 * 1000) {
            this.onGame = false;
            this.onPause = false;

            if (this.level < Levels.length) {
                message = 'Level Completed!';
                callback = this.game.bind(this);
                duration = 2000;
                this.level++;
            } else {
                message = 'Congrats! You\'ve Completed All Game Levels - Score ' + this.score;
                callback = this.load.bind(this);
                duration = 5000;
                this.level = 0;
            }

            this.splash(message, duration, callback);

            return;
        }

        requestAnimationFrame(this.loop.bind(this), this.canvas);
    };

    /**
     * Clean game event listeners.
     */
    clearEventListeners() {
        this.canvas.removeEventListener('click', this.onClick, false);
        this.canvas.removeEventListener('contextmenu', this.onContextMenu, false);
        this.canvas.removeEventListener('mousemove', this.onMouseMove, false);
        this.canvas.removeEventListener('mouseout', this.onMouseOut, false);
        this.canvas.removeEventListener('keyup', this.onKeyUp, false);
    };

    /**
     * On mouse move event handler.
     *
     * @param event Event object.
     */
    onMouseMove(event) {
        this.guard.x = (event.pageX - this.canvas.offsetLeft - 15) * SCALE;
        this.guard.y = (event.pageY - this.canvas.offsetTop - 15) * SCALE;
    };

    /**
     * On mouse out event handler.
     *
     * @param event Event object.
     */
    onMouseOut(event) {
        this.onPause = true;
    };

    /**
     * On click event handler.
     *
     * @param event Event object.
     */
    onClick(event) {
        if (this.onGame && !this.onPause) {
            this.defuseBomb(); // must be executed before the next command!
        }

        if (!this.onGame && !this.onPause) {
            this.game();
        }
    };

    /**
     * On key up event handler.
     *
     * @param event Event object.
     */
    onKeyUp(event) {
        if (event.keyCode == KEY_ESCAPE && !this.onPause) {
            this.onGame = false;
            this.onPause = false;
            // reset stuff
            this.score = 0;
            this.level = 0;
            this.clearEventListeners();
            this.splash('Game Over', 1000, this.load);
        }
    };

    /**
     * On context menu pop up event handler.
     *
     * @param {Event} event Event object.
     *
     * @return {boolean} Returns false in order to disable the event.
     */
    onContextMenu(event) {
        if (this.onGame && !this.onPause) {
            this.onPause = true;
        } else if (this.onGame && this.onPause) {
            this.onPause = false;
        }
        event.preventDefault();
        return false;
    }

    /**
     * Get date difference.
     *
     * @param {Date} date1 First date object.
     * @param {Date} date2 Second date object.
     *
     * @return {Object} Returns the date difference values.
     */
    datediff(date1, date2) {
        // @link http://stackoverflow.com/a/7709819/1718162
        // @link http://stackoverflow.com/a/13894670/1718162
        const diff = {};
        diff.ms = (date1 - date2);
        diff.days = Math.round(diff.ms / 86400000);
        diff.hours = Math.round((diff.ms % 86400000) / 3600000);
        diff.minutes = Math.round(((diff.ms % 86400000) % 3600000) / 60000);
        diff.seconds = parseInt((date1.getTime() - date2.getTime()) / 1000);
        return diff;
    };

    /**
     * Check collision between objects.
     *
     * @param {Object} obj1{x, y, width, height} First collision object.
     * @param {Object} obj2{x, y, width, height} Second collision object.
     *
     * @return {boolean} Returns whether the objects collide or not.
     */
    collides(obj1, obj2) {
        let x1, y1, w1, h1; // obj1
        let x2, y2, w2, h2; // obj2

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
            ((y1 < y2 && (y1 + h1) > y2)
                || (y1 > y2 && (y1 + h1) < (y2 + h2))
                || (y1 > y2 && y1 < (y2 + h2))))
            ? true : false;
    };

    /**
     * Draw game stats.
     *
     * @param {boolean} onPause whether the game is on pause mode.
     */
    drawStats(onPause) {
        let currDate = (!onPause) ? new Date() : this.lastUpdateTime;
        let time = this.datediff(currDate, this.levelStartTime);
        let diff = new Date((Levels[this.level].time * 60 * 1000) - time.ms);
        let minutes = (diff.getMinutes() < 10) ? '0' + diff.getMinutes() : diff.getMinutes();
        let seconds = (diff.getSeconds() < 10) ? '0' + diff.getSeconds() : diff.getSeconds();

        this.ctx.textAlign = 'left';
        this.ctx.font = 12 * SCALE + 'pt Arial';
        this.ctx.fillStyle = '#5CFF8F';

        this.ctx.fillText('Level ' + (this.level + 1), 20 * SCALE, 30 * SCALE);
        this.ctx.fillText('Time ' + minutes + ':' + seconds, 20 * SCALE, 50 * SCALE); // time
        this.ctx.fillText('Score ' + this.score, 20 * SCALE, 70 * SCALE); // score

        this.ctx.textAlign = 'right';
        this.ctx.lineWidth = '1';
        let gColor = this.getBarColor(this.guard.shield, onPause);
        let sColor = this.getBarColor(this.spaceship.shield, onPause);

        this.ctx.fillStyle = gColor;
        this.ctx.fillText('Guard ' + this.guard.shield + '%', (this.canvas.width - 20) * SCALE, 30 * SCALE); // guard
        this.ctx.fillStyle = sColor;
        this.ctx.fillText('Spaceship ' + this.spaceship.shield + '%', (this.canvas.width - 20) * SCALE, 80 * SCALE); // spaceship

        gColor = this.getBarColor(this.guard.shield, onPause, true);
        sColor = this.getBarColor(this.spaceship.shield, onPause, true);

        this.ctx.strokeStyle = gColor;
        this.ctx.strokeRect((this.canvas.width - 152) * SCALE, 40, 130, 15);
        this.ctx.fillStyle = gColor;
        this.ctx.fillRect((this.canvas.width - 152) * SCALE, 40, this.guard.shield / 100 * 130, 15);

        this.ctx.strokeStyle = sColor;
        this.ctx.strokeRect((this.canvas.width - 152) * SCALE, 90, 130, 15);
        this.ctx.fillStyle = sColor;
        this.ctx.fillRect((this.canvas.width - 152) * SCALE, 90, this.spaceship.shield / 100 * 130, 15);
    };

    /**
     * Calculate the status bar colors.
     *
     * @param {number} value Status bar value.
     * @param {boolean} onPause Whether the game is on pause mode.
     * @param {number} opaque Opacity levels.
     *
     * @return {string} Returns the color value.
     */
    getBarColor(value, onPause, opaque) {
        let color;

        if (value > 70) {
            color = (!onPause && opaque) ? 'rgba(92, 255, 201, 0.9)' : '#5CFFC9'; // cyan
        } else if (value > 40) {
            color = (!onPause && opaque) ? 'rgba(92, 255, 143, 0.9)' : '#5CFF8F'; // green
        } else if (value > 15) {
            color = (!onPause && opaque) ? 'rgba(255, 149, 92, 0.9)' : '#FF955C'; // orange
        } else {
            color = (!onPause && opaque) ? 'rgba(255, 92, 92, 0.9)' : '#FF5C5C'; // red
        }

        return color;
    };

    /**
     * The guard is able to defuse nearby bomb, but this will also destroy any nearby objects.
     */
    defuseBomb() {
        if (this.onDefuse) {
            return false;
        }

        this.onDefuse = true;

        let defuseInterval = setInterval(() => {
            this.currentDefuseRadius++;
            this.randomObjects.forEach((obj) => {
                let distance = Math.sqrt(Math.pow((this.guard.x + 15 - obj.x), 2) + Math.pow((this.guard.y + 15 - obj.y), 2));

                if (distance <= this.currentDefuseRadius) {
                    obj.destroyed = true;
                    if (obj.type == OBJ_TYPE_BOMB) {
                        this.score += BOMB_SCORE;
                    }
                }
            });

            if (this.currentDefuseRadius == this.guard.defuseRadius) {
                clearInterval(defuseInterval);
                this.currentDefuseRadius = 0;
                this.onDefuse = false;
            }
        }, 7);
    };

    /**
     * Display splash screen with a custom message.
     *
     * @param {string} text The message to be displayed on the splash screen.
     * @param {int} duration The amount of time that the splash screen will remain on canvas.
     * @param {Function} callback This method will be called after the splash is finished.
     */
    splash(text, duration, callback) {
        const drawStartTime = new Date();

        let drawSplashScreen = () => {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width * SCALE, this.canvas.height * SCALE);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24pt Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.canvas.width * SCALE / 2, this.canvas.height * SCALE / 2);

            if (this.datediff(new Date(), drawStartTime).ms > duration) { // end of splash screen
                if (callback) {
                    callback();
                }
                return;
            }

            requestAnimationFrame(drawSplashScreen, this.canvas);
        };

        drawSplashScreen();
    };

    /**
     * Convert the creation rate from percentage into a value that will be compared with the random value.
     *
     * @param {number} rate Creation rate in percentage.
     *
     * @return {number} Returns the number that is going to be compared with the random value.
     */
    convertRate(rate) {
        return (1000 - rate * 10);
    };

    /**
     * Draw credits on screen.
     */
    drawCredits() {
        this.ctx.fillStyle = '#515151';
        this.ctx.font = '8pt Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Copyright © ' + (new Date().getFullYear()) + ' - alextselegidis.com', (this.canvas.width - 10) * SCALE, (this.canvas.height - 10) * SCALE)
    };

    /**
     * Wrap text into the provided width.
     *
     * {@link http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial}
     *
     * @param {string} text Text to be wrapped.
     * @param {number} x Left position.
     * @param {number} y Top position.
     * @param {number} maxWidth Max width of the text.
     * @param {number} lineHeight Line height value.
     */
    wrapText(text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = this.ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, y);
    };

    /**
     * Draw intro screen.
     */
    drawIntroScreen() {
        // Splash
        this.ctx.drawImage(this.sprites.introScreen, 1, 1);

        // Text
        this.ctx.font = (30 * SCALE).toString() + 'pt helvetica';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText('Spaceguard', this.cx, this.cy - 220 * SCALE);
        this.ctx.font = (20 * SCALE).toString() + 'pt helvetica';
        this.ctx.fillText('Click to Start', this.cx, this.cy + 250 * SCALE);
        this.canvas.style['cursor'] = 'default';
    };
}
