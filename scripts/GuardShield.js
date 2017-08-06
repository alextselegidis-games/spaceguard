import {SCALE} from './Constants';
import GameLevels from './Levels';

/**
 * Guard shield power up.
 * @param {SpaceGuard} spaceguard SpaceGuard game instance.
 */
export default function (spaceguard) {
    this.sg = spaceguard;
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
        if (this.sg.guard.shield > GameLevels[this.sg.level].guard.shield)
            this.sg.guard.shield = GameLevels[this.sg.level].guard.shield;
        this.sg.score += SHIELD_SCORE;
        this.destroyed = true;
    };
};