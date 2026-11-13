
import './style.css';

import Game from './game/Game.js';

window.addEventListener('DOMContentLoaded', () => {

    const game = new Game();

    // Accessible for debugging in browser console
    window.racingGame = game;

});
