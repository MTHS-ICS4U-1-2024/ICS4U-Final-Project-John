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
        // Set background color to black
        this.cameras.main.setBackgroundColor(0x000000);

        // Display "Game Over" text
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
            // Restart the Game scene and reset the state
            this.scene.stop('Game'); // Stop the current game instance
            this.scene.start('Game'); // Start a new game instance
        });
    }

    shutdown() {
        // Resume the Game scene if needed
        this.scene.resume('Game');
    }
}
