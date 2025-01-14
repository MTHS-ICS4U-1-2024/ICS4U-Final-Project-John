import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

// Ensure the container exists or reference the existing one
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
    width: 960, // Game canvas width
    height: 1280, // Game canvas height
    parent: containerId, // Attach Phaser to the dynamically created container
    backgroundColor: '#028af8', // Background color of the game
    scale: {
        mode: Phaser.Scale.FIT, // Keeps the canvas proportional
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game on the screen
    },
    physics: {
        default: 'arcade', // Use the arcade physics system
        arcade: {
            debug: false, // Disable debugging for hitboxes
            gravity: { x: 0, y: 0 }, // No gravity (top-down gameplay)
        },
    },
    scene: [
        Boot,       // Initial boot scene
        Preloader,  // Asset loading scene
        MainMenu,   // Main menu scene
        MainGame,   // Core game scene
        GameOver,   // Game over scene
    ],
};

// Initialize Phaser game with the config
export default new Game(config);
