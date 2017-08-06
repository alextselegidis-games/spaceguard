import {SCALE, SHIELD_SCORE, OBJ_TYPE_GSHIELD} from './Constants';
import GameLevels from './Levels';

/**
 * Guard shield power up.
 */
export default class GuardShield {
    /**
     * Class constructor.
     *
     * @param {Spaceguard} spaceguard Spaceguard game instance.
     */
    constructor(spaceguard) {
        this.spaceguard = spaceguard;
        this.type = OBJ_TYPE_GSHIELD;
        this.color = '#36BDEB';
        this.destroyed = false;
        this.x = Math.round(Math.random() * this.spaceguard.canvas.width * SCALE);
        this.y = Math.round(Math.random() * this.spaceguard.canvas.height * SCALE);
        this.width = 30 * SCALE;
        this.height = 30 * SCALE;
        this.shield = 10; // base power up value
        this.value = Math.round(Math.random() * this.shield) + this.shield;
    }

    /**
     * Trigger GuardShield object.
     */
    trigger() {
        this.spaceguard.guard.shield += this.value;
        if (this.spaceguard.guard.shield > GameLevels[this.spaceguard.level].guard.shield)
            this.spaceguard.guard.shield = GameLevels[this.spaceguard.level].guard.shield;
        this.spaceguard.score += SHIELD_SCORE;
        this.destroyed = true;
    }
};