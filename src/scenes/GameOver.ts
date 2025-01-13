import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;
    restart_text: Phaser.GameObjects.Text;
    final_score_text: Phaser.GameObjects.Text;
    final_lives_text: Phaser.GameObjects.Text;
    player_name_text: Phaser.GameObjects.Text;
    highest_score_text: Phaser.GameObjects.Text;
    name_input: Phaser.GameObjects.DOMElement;

    constructor() {
        super('GameOver');
    }

    create() {
        // Set up camera and background color
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000); // Red background for Game Over

        // Background image
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        // Game Over text
        this.gameover_text = this.add.text(512, 200, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        });
        this.gameover_text.setOrigin(0.5);

        // Display Final Score
        const finalScore = this.registry.get('score') || 0; // Get the score stored in the registry
        this.final_score_text = this.add.text(512, 300, `Score: ${finalScore}`, {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        });
        this.final_score_text.setOrigin(0.5);

        // Display Final Lives
        const finalLives = this.registry.get('lives') || 0; // Get the lives stored in the registry
        this.final_lives_text = this.add.text(512, 350, `Lives: ${finalLives}`, {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        });
        this.final_lives_text.setOrigin(0.5);

        // Prompt player to input their name
        this.player_name_text = this.add.text(512, 400, 'Enter your name:', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        });
        this.player_name_text.setOrigin(0.5);

        // Create the input field for name
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style.fontSize = '32px';
        inputElement.style.width = '400px';
        inputElement.style.textAlign = 'center';
        inputElement.placeholder = 'Type name here';
        this.name_input = this.add.dom(512, 450, inputElement);
        this.name_input.setOrigin(0.5);

        // Event listener for name input
        inputElement.addEventListener('keydown', (event) => {
            // If the player presses Enter, save the name and update the scoreboard
            if (event.key === 'Enter') {
                const playerName = inputElement.value.trim();
                if (playerName.length > 0) {
                    this.registry.set('playerName', playerName); // Store name in the registry
                    this.updateScoreboard(finalScore); // Update the scoreboard
                    this.final_score_text.setText(`Name: ${playerName} - Score: ${finalScore}`);
                }
            }
        });

        // Restart text to indicate to the player that they can click to play again
        this.restart_text = this.add.text(512, 550, 'Click to Play Again', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        });
        this.restart_text.setOrigin(0.5);

        // Event listener to restart or return to main menu when the player clicks anywhere
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu'); // Transition to the MainMenu scene
        });
    }

    updateScoreboard(score: number) {
        // Get the highest score stored in localStorage
        const highestScore = parseInt(localStorage.getItem('highestScore') || '0');
        
        // Update highest score if current score is greater
        if (score > highestScore) {
            localStorage.setItem('highestScore', score.toString());
            this.highest_score_text.setText(`Highest Score: ${score}`);
        }

        // Display the updated highest score
        this.highest_score_text = this.add.text(512, 500, `Highest Score: ${highestScore}`, {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        });
        this.highest_score_text.setOrigin(0.5);
    }
}
