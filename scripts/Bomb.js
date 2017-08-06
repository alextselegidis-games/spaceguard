import {SCALE} from './Constants';

/**
 * Bomb that explodes when the guard collides with it.
 */
export default class Bomb {
    /**
     * Class constructor.
     *
     * @param {SpaceGuard} Spaceguard game instance.
     */
    constructor(spaceguard) {
        this.sg = spaceguard;
        this.type = OBJ_TYPE_BOMB;
        this.color = '#6C17AD';
        this.x = Math.round(Math.random() * this.sg.canvas.width * SCALE);
        this.y = Math.round(Math.random() * this.sg.canvas.height * SCALE);
        this.width = 30 * SCALE;
        this.height = 30 * SCALE;
        this.damage = 20; // base damage value
        this.value = Math.ceil(Math.random() * this.damage) + this.damage;
    }

    /**
     * Trigger Bomb object.
     */
    trigger() {
        this.sg.guard.shield -= this.value;
        this.destroyed = true;
    }
};