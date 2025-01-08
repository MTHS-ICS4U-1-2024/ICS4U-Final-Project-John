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
        this.logo = this.add.image(512, 300, 'logo');

        // Set up the title text
        this.title = this.add.text(512, 460, 'Click to Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Add a pointerdown event to start the game when anywhere on the screen is clicked
        this.input.once('pointerdown', () => {
            this.scene.start('Game'); // Switch to the 'Game' scene
        });
    }
}
