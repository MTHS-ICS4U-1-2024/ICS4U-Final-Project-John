import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        // Set up the background image
        this.background = this.add.image(512, 384, 'background');

        // Set up the logo image
        this.logo = this.add.image(512, 250, 'logo'); // Adjusted logo position for more space

        // Set up the title text
        this.title = this.add.text(512, 550, 'Press Space to Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5); // Added some space between text and logo by moving text position down

        // Add a keyboard input event to change scene when spacebar is pressed
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log('Switching to Game scene...');
            this.scene.start('Game'); // Use start instead of switch
        });
    }
}
