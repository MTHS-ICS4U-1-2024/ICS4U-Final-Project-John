import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load assets used in the Boot scene (essential game images and the logo)
        this.load.image('background', 'assets/background.png'); // Background image
        this.load.image('logo', 'assets/logo.png'); // Logo image

        // Load assets for the Frogger game (gameboard, frog, cars, etc.)
        this.load.image('gameboard', 'assets/gameboard.png'); // Gameboard background
        this.load.image('frog', 'assets/frog.png'); // Frog sprite
        this.load.image('car', 'assets/car.png'); // Car sprite

        // Optionally, load more assets if needed
        // E.g., additional obstacles, animations, UI elements, etc.
    }

    create() {
        // Set up the background image
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Set up the logo
        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'logo');
        logo.setScale(0.5);

        // Add loading text (for visual feedback)
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 100, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5);

        // Transition to the Preloader scene after a short delay
        this.time.delayedCall(1000, () => {
            // Start the Preloader scene after assets are ready
            this.scene.start('Preloader');
        });
    }
}
