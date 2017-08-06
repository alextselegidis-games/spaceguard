import SpaceGuard from './SpaceGuard';
import {requestAnimFrame} from './Environment';

// Initialize the game.
window.requestAnimFrame = requestAnimFrame;
window.spaceguard = new SpaceGuard();