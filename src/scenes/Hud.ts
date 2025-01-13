import { Scene } from 'phaser';

export class Hud extends Scene {
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private lives: number;
    private livesText: Phaser.GameObjects.Text;
    private timer: Phaser.Time.TimerEvent;
    private timeText: Phaser.GameObjects.Text;

    constructor() {
        super('Hud');
    }

    create() {
        // Initialize HUD elements
        this.score = 0;
        this.lives = 3; // Start with 3 lives

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
            delay: 1000,
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
        if (this.timer.getProgress() === 1) {
            // Handle when time runs out (game over or level end)
            return;
        }
        let remainingTime = Math.floor(this.timer.getRemainingSeconds());
        this.timeText.setText(`Time: ${remainingTime < 10 ? '0' + remainingTime : remainingTime}`);
    }

    // Method to reset the HUD if needed (e.g., after level reset)
    resetHud() {
        this.score = 0;
        this.lives = 3;
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
        this.timer.reset({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });
    }
}
