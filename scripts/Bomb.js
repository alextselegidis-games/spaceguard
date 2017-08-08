/* ----------------------------------------------------------------------------
 * Spaceguard - Arcade Space Game written in JavaScript
 *
 * @package     Spaceguard
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://alextselegidis.com/spaceguard
 * ---------------------------------------------------------------------------- */

import {SCALE, OBJ_TYPE_BOMB} from './Constants';

/**
 * Bomb Class
 *
 * Space object that explodes when the guard collides with it.
 */
export default class Bomb {
    /**
     * Class constructor.
     *
     * @param {Spaceguard} spaceguard Spaceguard game instance.
     */
    constructor(spaceguard) {
        this.spaceguard = spaceguard;
        this.type = OBJ_TYPE_BOMB;
        this.x = Math.round(Math.random() * this.spaceguard.canvas.width * SCALE);
        this.y = Math.round(Math.random() * this.spaceguard.canvas.height * SCALE);
        this.width = 30 * SCALE;
        this.height = 30 * SCALE;
        this.damage = 20; // base damage value
        this.value = Math.ceil(Math.random() * this.damage) + this.damage;
    }

    /**
     * Trigger bomb object.
     */
    trigger() {
        this.spaceguard.guard.shield -= this.value;
        this.destroyed = true;
    }
};