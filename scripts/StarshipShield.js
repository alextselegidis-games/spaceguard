/* ----------------------------------------------------------------------------
 * Spaceguard - Arcade Space Game written in JavaScript
 *
 * @package     Spaceguard
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://alextselegidis.com/spaceguard
 * ---------------------------------------------------------------------------- */

import {SCALE, SHIELD_SCORE, OBJ_TYPE_SSHIELD} from './Constants';
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
        this.spaceguard = spaceguard;
        this.type = OBJ_TYPE_SSHIELD;
        this.color = '#36EB57';
        this.x = Math.round(Math.random() * this.spaceguard.canvas.width * SCALE);
        this.y = Math.round(Math.random() * this.spaceguard.canvas.height * SCALE);
        this.width = 30 * SCALE;
        this.height = 30 * SCALE;
        this.shield = 10; // base power up value
        this.value = Math.round(Math.random() * this.shield) + this.shield;
    }

    /**
     * Trigger Starship Shield object.
     */
    trigger() {
        this.spaceguard.starship.shield += this.value;
        if (this.spaceguard.starship.shield > GameLevels[this.spaceguard.level].starship.shield){
            this.spaceguard.starship.shield = GameLevels[this.spaceguard.level].starship.shield;
        }
        this.spaceguard.score += SHIELD_SCORE;
        this.destroyed = true;
    };
};