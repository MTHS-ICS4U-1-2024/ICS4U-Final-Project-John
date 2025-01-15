import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

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
        this.logo.setDisplaySize(width * 0.6, height * 0.2); // Scale logo proportionally

        // Set up the title text
        this.title = this.add.text(width / 2, height * 0.7, 'Press Space to Play', {
            fontFamily: 'Arial Black',
            fontSize: `${Math.round(height * 0.05)}px`, // Font size as 5% of game height
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.round(height * 0.005), // Stroke thickness as 0.5% of height
            align: 'center',
        }).setOrigin(0.5);

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
