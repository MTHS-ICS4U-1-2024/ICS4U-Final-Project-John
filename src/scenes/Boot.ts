import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load essential assets for the Preloader and other scenes
        this.load.image('background', 'assets/background.png'); // Background image
        this.load.image('logo', 'assets/logo.png'); // Logo image
        this.load.image('gameboard', 'assets/gameboard.png');
        this.load.image('car', 'assets/car.png'); // Car image
        this.load.image('frog', 'assets/frog.png'); // Frog sprite
    }

    create() {
        // Set up the background image
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Set up the logo
        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'logo');
        logo.setScale(0.5);

        // Add loading text
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
            this.scene.start('Preloader');
        });
    }
}
