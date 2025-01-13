import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";

// Ensure the container exists or create it dynamically
const containerId = 'game-container';
let container = document.getElementById(containerId);

if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
}

// Set up Phaser game configuration
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,  // Match your container size
    height: 768,  // Match your container size
    parent: containerId,  // Ensure it matches the created container
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,  // Keeps the canvas proportional
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centers the game on the screen
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

// Initialize Phaser game with the config
export default new Game(config);
