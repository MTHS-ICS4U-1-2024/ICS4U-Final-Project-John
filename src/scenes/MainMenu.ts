import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Set up the background image
        this.background = this.add.image(512, 384, 'background');

        // Set up the logo image
        this.logo = this.add.image(512, 300, 'logo');

        // Set up the clickable title text
        this.title = this.add.text(512, 460, 'Click to Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Make the title text interactive
        this.title.setInteractive();

        // Add a pointerdown event to start the game when the title is clicked
        this.title.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
