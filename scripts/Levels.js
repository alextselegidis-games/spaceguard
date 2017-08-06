/* ----------------------------------------------------------------------------
 * Spaceguard - Arcade Space Game written in JavaScript
 *
 * @package     Spaceguard
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://alextselegidis.com/spaceguard
 * ---------------------------------------------------------------------------- */

import {SCALE} from './Constants';

/**
 * Game levels definition.
 *
 * Adjusts the way Spaceguard is going to handle each level. The game should become more and more hard to
 * play as the user progress advances.
 *
 * @type {Object[]}
 */
export default [
    // lvl 1
    {
        time: 1, // minutes
        background: 'img-path', // image element id
        guard: {
            shield: 100, // % percent
            defuseRadius: 80
        },
        spaceship: {
            shield: 100 // % percent
        },
        comet: {
            speed: 7 * SCALE, // points
            damage: 10, // points
            creationRate: 15  // % percent
        },
        bomb: {
            creationRate: 35 // % percent
        },
        guardShield: {
            creationRate: 20 // % percent
        },
        spaceshipShield: {
            creationRate: 10 // % percent
        }
    },
    // lvl 2
    {
        time: 2,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 85
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 8 * SCALE,
            damage: 13,
            creationRate: 20  // if higher less will be created
        },
        bomb: {
            creationRate: 40
        },
        guardShield: {
            creationRate: 20
        },
        spaceshipShield: {
            creationRate: 12
        }
    },
    // lvl 3
    {
        time: 2,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 85
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 8 * SCALE,
            damage: 13,
            creationRate: 25  // if higher less will be created
        },
        bomb: {
            creationRate: 40
        },
        guardShield: {
            creationRate: 22
        },
        spaceshipShield: {
            creationRate: 15
        }
    },
    // lvl 4
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 90
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 8 * SCALE,
            damage: 20,
            creationRate: 35  // if higher less will be created
        },
        bomb: {
            creationRate: 45
        },
        guardShield: {
            creationRate: 30
        },
        spaceshipShield: {
            creationRate: 25
        }
    },
    // lvl 5
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 90
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        spaceshipShield: {
            creationRate: 25
        }
    },
    // lvl 6
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 95
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        spaceshipShield: {
            creationRate: 25
        }
    },
    // lvl 7
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 95
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        spaceshipShield: {
            creationRate: 25
        }
    },
    // lvl 8
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 95
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        spaceshipShield: {
            creationRate: 25
        }
    },
    // lvl 9
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 100
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        spaceshipShield: {
            creationRate: 25
        }
    },
    // lvl 10
    {
        time: 3,
        background: 'img-path',
        guard: {
            shield: 100,
            defuseRadius: 110
        },
        spaceship: {
            shield: 100
        },
        comet: {
            speed: 9 * SCALE,
            damage: 20,
            creationRate: 40  // if higher less will be created
        },
        bomb: {
            creationRate: 50
        },
        guardShield: {
            creationRate: 35
        },
        spaceshipShield: {
            creationRate: 25
        }
    }
];