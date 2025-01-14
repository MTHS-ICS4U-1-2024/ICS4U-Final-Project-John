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
        this.timeRemaining = this.timeLimit;  // Start with 0 elapsed time

        // Display score
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });

        // Display lives
        this.livesText = this.add.text(16, 48, `Lives: ${this.lives}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });

        // Display timer
        this.timeText = this.add.text(this.cameras.main.width - 150, 16, 'Time: 00', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });

        // Set up a timer for the countdown or time-based gameplay mechanics
        this.timer = this.time.addEvent({
            delay: 1000,  // Timer updates every 1 second
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
        this.timeRemaining--;  // Decrease the remaining time by 1 second

        // Update the time display
        this.timeText.setText(`Time: ${this.timeRemaining < 10 ? '0' + this.timeRemaining : this.timeRemaining}`);

        // If 60 seconds have passed and the player has not reached the goal, deduct a life
        if (this.timeRemaining <= 0) {
            // Reset time and deduct a life
            this.timeRemaining = this.timeLimit;  // Reset to 60 seconds
            this.lives -= 1;  // Deduct a life for the player
            this.livesText.setText(`Lives: ${this.lives}`);

            // If no lives are left, game over logic can go here
            if (this.lives <= 0) {
                this.scene.start('GameOver', { score: this.score });
            }
        }
    }

    // Method to reset the HUD if needed (e.g., after level reset)
    resetHud() {
        this.score = 0;
        this.lives = 3;
        this.timeRemaining = this.timeLimit; // Reset time remaining to 60 seconds
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
        this.timer.reset({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });
    }
}
