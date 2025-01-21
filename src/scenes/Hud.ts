import { Scene } from 'phaser';

export class Hud extends Scene {
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private lives: number;
    private livesText: Phaser.GameObjects.Text;
    private timeRemaining: number; // Remaining time
    private timeText: Phaser.GameObjects.Text;

    private readonly timeLimit: number = 30; // Time limit in seconds
    private timerEvent: Phaser.Time.TimerEvent;

    constructor() {
        super('Hud');
    }

    create() {
        // Initialize HUD values
        this.score = 0;
        this.lives = 3;
        this.timeRemaining = this.timeLimit;

        // Create score text
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
        });

        // Create lives text
        this.livesText = this.add.text(16, 64, `Lives: ${this.lives}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
        });

        // Create timer text
        this.timeText = this.add.text(this.cameras.main.width - 180, 16, `Time: ${this.timeRemaining}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
        });

        // Start the timer event
        this.startTimer();
    }

    // Update score when rows are climbed
    addRowScore(rowScore: number) {
        this.score += rowScore; // Increment score by rowScore (e.g., 10 points)
        this.updateScoreDisplay();
    }

    // Multiply score when a goal is reached
    applyScoreMultiplier(multiplier: number) {
        this.score *= multiplier; // Multiply score by the number of rows climbed
        this.updateScoreDisplay();
    }

    // General method to update the score display
    private updateScoreDisplay() {
        this.scoreText.setText(`Score: ${this.score}`);
    }

    // Update lives display
    updateLives(newLives: number) {
        this.lives = newLives;
        this.livesText.setText(`Lives: ${this.lives}`);
    }

    // Timer countdown logic
    private updateTime() {
        this.timeRemaining--;

        // Update the timer display
        this.timeText.setText(`Time: ${this.timeRemaining < 10 ? '0' + this.timeRemaining : this.timeRemaining}`);

        // Handle timer reaching 0
        if (this.timeRemaining <= 0) {
            this.timeRemaining = this.timeLimit; // Reset time
            this.lives--; // Deduct a life
            this.updateLives(this.lives);

            // If no lives are left, stop the timer and go to GameOver
            if (this.lives <= 0) {
                this.timerEvent.remove(); // Stop the timer
                this.hideHud(); // Hide HUD elements
                this.scene.start('GameOver', { score: this.score }); // Transition to GameOver scene
            }
        }
    }

    // Start the timer
    private startTimer() {
        if (this.timerEvent) {
            this.timerEvent.remove(); // Ensure no duplicate timers
        }

        this.timerEvent = this.time.addEvent({
            delay: 1000, // Timer updates every 1 second
            callback: this.updateTime,
            callbackScope: this,
            loop: true,
        });
    }

    // Hide HUD elements when transitioning to GameOver
    private hideHud() {
        this.scoreText.setVisible(false);
        this.livesText.setVisible(false);
        this.timeText.setVisible(false);
    }

    // Reset HUD for a new game or level
    resetHud() {
        this.score = 0;
        this.lives = 3;
        this.timeRemaining = this.timeLimit;

        this.updateScoreDisplay();
        this.updateLives(this.lives);
        this.timeText.setText(`Time: ${this.timeRemaining}`);

        // Make HUD visible again
        this.scoreText.setVisible(true);
        this.livesText.setVisible(true);
        this.timeText.setVisible(true);

        this.startTimer(); // Restart the timer
    }
}
