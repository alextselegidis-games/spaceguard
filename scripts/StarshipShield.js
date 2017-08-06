import {SCALE, SHIELD_SCORE} from './Constants';
import GameLevels from './Levels';

/**
 * Starship shield power up.
 */
export default class Spaceguard {
    /**
     * Class constructor.
     *
     * @param {Spaceguard} spaceguard Spaceguard game instance.
     */
    constructor(spaceguard) {
        this.sg = spaceguard;
        this.type = OBJ_TYPE_SSHIELD;
        this.color = '#36EB57';
        this.x = Math.round(Math.random() * this.sg.canvas.width * SCALE);
        this.y = Math.round(Math.random() * this.sg.canvas.height * SCALE);
        this.width = 30 * SCALE;
        this.height = 30 * SCALE;
        this.shield = 10; // base power up value
        this.value = Math.round(Math.random() * this.shield) + this.shield;
    }

    /**
     * Trigger Starship Shield object.
     */
    trigger() {
        this.sg.starship.shield += this.value;
        if (this.sg.starship.shield > GameLevels[this.sg.level].starship.shield)
            this.sg.starship.shield = GameLevels[this.sg.level].starship.shield;
        this.sg.score += SHIELD_SCORE;
        this.destroyed = true;
    };
};