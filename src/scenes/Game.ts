import { Scene } from 'phaser';
import { Hud } from './Hud';
import { Car } from './Car'; // Assuming you have a Car class for the cars
import { Frog } from './Frog'; // Assuming you have a Frog class for the player character
import { GameOver } from './GameOver'; // GameOver scene for handling the end of the game

export class Game extends Scene {
    private frog: Phaser.GameObjects.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private cars: Phaser.GameObjects.Group;
    private gameOver: boolean;
    private lives: number;
    private hud: Hud;

    constructor() {
        super('Game');
    }

    create() {
        // Initialize variables
        this.score = 0;
        this.lives = 3; // Starting lives
        this.gameOver = false;

        // Set up the gameboard background
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'gameboard');

        // Create frog sprite and set initial position
        this.frog = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height - 100, 'frog');
        this.frog.setOrigin(0.5);

        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Display the score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });

        // Add the HUD scene for lives and score
        this.hud = this.scene.add('Hud', Hud);
        this.scene.launch('Hud');

        // Create a group for the cars (assuming you have a Car class)
        this.cars = this.physics.add.group({
            classType: Car,
            runChildUpdate: true, // Automatically update the cars in the group
        });

        // Add initial cars to the scene
        this.spawnCars();

        // Set up collision detection between the frog and the cars
        this.physics.add.collider(this.frog, this.cars, this.handleCarCollision, null, this);

        // Set up the game over condition check
        this.time.addEvent({
            delay: 1000,
            callback: this.checkGameOver,
            callbackScope: this,
            loop: true,
        });
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Handle frog movement
        if (this.cursors.left.isDown) {
            this.frog.x -= 5; // Move left
        } else if (this.cursors.right.isDown) {
            this.frog.x += 5; // Move right
        }

        if (this.cursors.up.isDown) {
            this.frog.y -= 5; // Move up
        } else if (this.cursors.down.isDown) {
            this.frog.y += 5; // Move down
        }

        // Handle boundary checks for frog
        if (this.frog.x < 0) {
            this.frog.x = 0;
        } else if (this.frog.x > this.cameras.main.width) {
            this.frog.x = this.cameras.main.width;
        }

        if (this.frog.y < 0) {
            this.frog.y = 0;
        } else if (this.frog.y > this.cameras.main.height) {
            this.frog.y = this.cameras.main.height;
        }

        // Update the score and lives in the HUD
        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);

        // Spawn new cars as needed
        this.cars.children.iterate((car: Car) => {
            car.update();
        });
    }

    private checkGameOver() {
        // Check for frog reaching the goal
        if (this.frog.y < 0) {
            this.score += 10; // Increase score for crossing
            this.frog.y = this.cameras.main.height - 100; // Reset frog position
        }

        // If frog collides with a car, game over logic is triggered
        if (this.frog.y > this.cameras.main.height) {
            this.gameOver = true;
            this.scene.start('GameOver', { score: this.score, lives: this.lives }); // Transition to Game Over scene
        }
    }

    private handleCarCollision(frog: Phaser.GameObjects.Sprite, car: Car) {
        // Decrease lives when the frog hits a car
        this.lives -= 1;
        this.hud.updateLives(this.lives);

        // Reset frog position if lives remain
        if (this.lives > 0) {
            frog.setPosition(this.cameras.main.centerX, this.cameras.main.height - 100); // Reset position
        } else {
            // If no lives are left, go to the game over scene
            this.scene.start('GameOver', { score: this.score, lives: this.lives });
        }
    }

    // Spawn cars periodically or as needed
    private spawnCars() {
        for (let i = 0; i < 5; i++) {
            const car = new Car(this, Phaser.Math.Between(50, this.cameras.main.width - 50), 100 + i * 100, 'car');
            this.cars.add(car);
        }
    }
}
