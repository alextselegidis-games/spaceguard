import {SCALE} from './Constants';
import GameLevels from './Levels';

/**
 * Starship shield power up.
 * @param {SpaceGuard} spaceguard SpaceGuard game instance.
 */
export default function (spaceguard) {
    this.sg = spaceguard;
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
        if (this.sg.starship.shield > GameLevels[this.sg.level].starship.shield)
            this.sg.starship.shield = GameLevels[this.sg.level].starship.shield;
        this.sg.score += SHIELD_SCORE;
        this.destroyed = true;
    };
};