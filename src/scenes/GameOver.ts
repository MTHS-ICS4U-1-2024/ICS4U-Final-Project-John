import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    restart_text: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        // Set up camera and background color
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);  // Red background for Game Over

        // Background image
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        // Game Over text
        this.gameover_text = this.add.text(512, 300, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.gameover_text.setOrigin(0.5);

        // Restart text to indicate to the player that they can click to restart or go to the main menu
        this.restart_text = this.add.text(512, 450, 'Click to return to Main Menu', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        });
        this.restart_text.setOrigin(0.5);

        // Event listener to restart or return to main menu when the player clicks anywhere
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');  // Transition to the MainMenu scene
        });
    }
}
