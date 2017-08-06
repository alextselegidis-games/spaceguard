import {SCALE, OBJ_TYPE_BOMB} from './Constants';

/**
 * Bomb that explodes when the guard collides with it.
 */
export default class Bomb {
    /**
     * Class constructor.
     *
     * @param {Spaceguard} Spaceguard game instance.
     */
    constructor(spaceguard) {
        this.spaceguard = spaceguard;
        this.type = OBJ_TYPE_BOMB;
        this.color = '#6C17AD';
        this.x = Math.round(Math.random() * this.spaceguard.canvas.width * SCALE);
        this.y = Math.round(Math.random() * this.spaceguard.canvas.height * SCALE);
        this.width = 30 * SCALE;
        this.height = 30 * SCALE;
        this.damage = 20; // base damage value
        this.value = Math.ceil(Math.random() * this.damage) + this.damage;
    }

    /**
     * Trigger Bomb object.
     */
    trigger() {
        this.spaceguard.guard.shield -= this.value;
        this.destroyed = true;
    }
};