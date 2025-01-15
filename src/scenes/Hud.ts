import { Scene } from 'phaser';

export class Hud extends Scene {
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private lives: number;
    private livesText: Phaser.GameObjects.Text;
    private timer: Phaser.Time.TimerEvent;
    private timeText: Phaser.GameObjects.Text;

    private timeLimit: number = 60; // Time limit in seconds
    private timeRemaining: number; // Remaining time

    constructor() {
        super('Hud');
    }

    create() {
        // Initialize HUD elements
        this.score = 0;
        this.lives = 3; // Start with 3 lives
        this.timeRemaining = this.timeLimit; // Start with 60 seconds

        // Display score with bubble effect
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff', // Base color
            stroke: '#000000', // Outline color
            strokeThickness: 8, // Outline thickness
            shadow: {
                offsetX: 4, // Horizontal shadow offset
                offsetY: 4, // Vertical shadow offset
                color: '#333333', // Shadow color
                blur: 8, // Shadow blur radius
                fill: true, // Apply shadow to the text fill
            },
        }).setOrigin(0, 0);

        // Display lives with bubble effect
        this.livesText = this.add.text(16, 64, `Lives: ${this.lives}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#333333',
                blur: 8,
                fill: true,
            },
        }).setOrigin(0, 0);

        // Display timer with bubble effect
        this.timeText = this.add.text(this.cameras.main.width - 180, 16, `Time: ${this.timeRemaining}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#333333',
                blur: 8,
                fill: true,
            },
        }).setOrigin(0, 0);

        // Set up a timer for the countdown
        this.timer = this.time.addEvent({
            delay: 1000, // Timer updates every 1 second
            callback: this.updateTime,
            callbackScope: this,
            loop: true,
        });
    }

    // Update score method
    updateScore(newScore: number) {
        this.score = newScore;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    // Update lives method
    updateLives(newLives: number) {
        this.lives = newLives;
        this.livesText.setText(`Lives: ${this.lives}`);
    }

    // Timer countdown method
    private updateTime() {
        this.timeRemaining--; // Decrease the remaining time by 1 second

        // Update the time display
        this.timeText.setText(`Time: ${this.timeRemaining < 10 ? '0' + this.timeRemaining : this.timeRemaining}`);

        if (this.timeRemaining <= 0) {
            this.timeRemaining = this.timeLimit; // Reset to the time limit
            this.lives--; // Deduct a life
            this.livesText.setText(`Lives: ${this.lives}`);

            if (this.lives <= 0) {
                this.scene.start('GameOver', { score: this.score }); // End the game
            }
        }
    }

    // Reset HUD for a new game or level
    resetHud() {
        this.score = 0;
        this.lives = 3;
        this.timeRemaining = this.timeLimit; // Reset time remaining
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
        this.timer.reset({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });
    }
}
