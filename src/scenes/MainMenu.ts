import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    titleBackground: GameObjects.Rectangle;

    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.scale; // Dynamically fetch the game's width and height

        // Set up the background image
        this.background = this.add.image(width / 2, height / 2, 'background');
        this.background.setDisplaySize(width, height); // Scale background to fit the canvas

        // Set up the logo image
        this.logo = this.add.image(width / 2, height * 0.3, 'logo'); // Position logo at 30% of height
        this.logo.setDisplaySize(width * 0.65, width * 0.5); // Set the logo size to 50% of the game width
        // Remove scaling to show the logo at full size
        this.logo.setOrigin(0.5);  // Center the logo

        // Set up the title text
        this.title = this.add.text(width / 2, height * 0.7, 'Press Space to Play', {
            fontFamily: 'Arial Black',
            fontSize: `${Math.round(height * 0.04)}px`, // Smaller font size as 4% of game height
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.round(height * 0.003), // Thinner stroke thickness
            align: 'center',
        }).setOrigin(0.5);

        // Create a background for the title with rounded corners
        this.titleBackground = this.add.rectangle(
            width / 2, height * 0.7, // Position at the same place as the title text
            this.title.width + 40, this.title.height + 20, // Make the rectangle larger than the text
            20, // Corner radius for rounded corners
            0x000000 // Black background color
        ).setOrigin(0.5).setAlpha(0.7); // Set background alpha for transparency

        // Apply Ken Burns effect (zooming in and out)
        this.tweens.add({
            targets: this.title,
            scale: 1.2, // Zoom in to 120% scale
            alpha: 0.8, // Fade in slightly
            duration: 1500, // Duration for the zooming and fading
            yoyo: true, // Make it go back to the original state after each animation cycle
            repeat: -1, // Repeat infinitely
            ease: 'Sine.easeInOut', // Smooth easing for the zoom effect
        });

        // Add a keyboard input event to change the scene when the spacebar is pressed
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log('Switching to Game scene...');
            this.scene.start('Game');
        });
    }
}
