import Spaceguard from './Spaceguard';
import {requestAnimFrame} from './Environment';

// Initialize the game.
window.requestAnimFrame = requestAnimFrame;
window.spaceguard = new Spaceguard();