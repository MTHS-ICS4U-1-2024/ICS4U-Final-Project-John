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

    // Update score display
    updateScore(newScore: number) {
        this.score = newScore;
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

    // Reset HUD for a new game or level
    resetHud() {
        this.score = 0;
        this.lives = 3;
        this.timeRemaining = this.timeLimit;

        this.updateScore(this.score);
        this.updateLives(this.lives);
        this.timeText.setText(`Time: ${this.timeRemaining}`);

        this.startTimer(); // Restart the timer
    }
}
