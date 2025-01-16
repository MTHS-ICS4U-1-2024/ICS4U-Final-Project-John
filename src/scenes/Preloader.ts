import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Set the path for assets
        this.load.setPath('assets');

        // Display the background and logo while loading
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);  // Background image
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'logo').setScale(0.5); // Logo image

        // Load general assets
        this.load.image('log', 'log.png');
        this.load.image('car', 'car.png');
        this.load.image('gameboard', 'gameboard.png'); // Corrected path
        this.load.image('turtle', 'turtle.png');

        // Load spritesheets for animations
        this.load.spritesheet('frog', 'frog_spritesheet.png', { frameWidth: 59, frameHeight: 50 });
        this.load.spritesheet('frog_dead', 'frog_dead.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('turtle_dive', 'turtle_dive.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // After assets are loaded, transition to the MainMenu scene
        this.scene.start('MainMenu');
    }
}
