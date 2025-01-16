import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load essential assets for the Boot scene (background and logo)
        this.load.image('background', 'assets/background.png'); // Background image
        this.load.image('logo', 'assets/logo.png'); // Logo image

        // A simple progress bar outline (border)
        const progressBarY = this.cameras.main.height - 50; // Adjust this value based on your desired distance
        this.add.rectangle(512, progressBarY, 300, 32, 0xffffff).setStrokeStyle(2, 0x000000);

        // Progress bar itself (inside the border)
        const bar = this.add.rectangle(512 - 150, progressBarY, 4, 28, 0xffffff).setOrigin(0, 0.5);

        // Add text to display loading status, positioning it slightly above the progress bar
        const loadingText = this.add.text(512, progressBarY - 40, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Update the progress bar width based on loading progress
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (296 * progress);  // Shortened width of the progress bar
            loadingText.setText(`Loading... ${Math.round(progress * 100)}%`);
        });
    }

    create() {
        // Set the background color to transparent to prevent the default blue background
        this.cameras.main.setBackgroundColor(0x00000000); // Transparent background

        // Set up the background image during the boot phase
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Scale background to fit the canvas

        // Set up the logo during the boot phase
        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'logo');
        // Remove scaling to show the logo at full size
        logo.setOrigin(0.5);  // Center the logo

        // Transition to the Preloader scene after a short delay
        this.time.delayedCall(1000, () => {
            this.scene.start('Preloader');
        });
    }
}
