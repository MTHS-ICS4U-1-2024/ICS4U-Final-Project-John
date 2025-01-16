import { Scene } from 'phaser';

export class GameOver extends Scene {
    private score: number;
    private finalScoreText: Phaser.GameObjects.Text;
    private restartText: Phaser.GameObjects.Text;

    constructor() {
        super('GameOver');
    }

    init(data: any) {
        // Receive the score data from the previous scene
        this.score = data.score || 0;
    }

    create() {
        // Make the background transparent (no background added)
        this.cameras.main.setBackgroundColor(0x000000, true); // Set transparent background

        // Pause the game when GameOver screen is shown
        this.scene.pause('Game');  // Assuming 'Game' is the main game scene you want to pause

        // Display game over text
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5);

        // Display the final score
        this.finalScoreText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Score: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5);

        // Instructions to restart the game
        this.restartText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Press SPACE to Restart', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5);

        // Listen for the space key to restart the game
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('MainMenu');  // Switch to the main menu (or whatever scene you want)
        });
    }

    // Ensures the game is paused and transparent background is set
    shutdown() {
        this.scene.resume('Game'); // Resume the 'Game' scene when the GameOver scene is shut down
    }
}
