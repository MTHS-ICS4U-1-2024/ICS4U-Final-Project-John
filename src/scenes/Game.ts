import { Scene } from 'phaser';
import { Hud } from './Hud';
import { Car } from './Car';
import { Frog } from './Frog';

export class Game extends Scene {
    private frog: Frog;
    private score: number;
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

        // Create the frog using the Frog class
        this.frog = new Frog(this, this.cameras.main.centerX, this.cameras.main.height - 100, 'frog');

        // Add the HUD scene for lives and score
        this.hud = this.scene.add('Hud', Hud);
        this.scene.launch('Hud');

        // Create a group for the cars
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

        // Update the frog
        this.frog.update();

        // Update the score and lives in the HUD
        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);

        // Update all cars
        this.cars.children.iterate((car: Car) => {
            car.update();
        });
    }

    private checkGameOver() {
        // Check for frog reaching the goal
        if (this.frog.hasReachedGoal()) {
            this.score += 10; // Increase score for crossing
            this.frog.resetPosition(); // Reset frog position
        }

        // If the frog's lives are 0, end the game
        if (this.lives <= 0) {
            this.gameOver = true;
            this.scene.start('GameOver', { score: this.score, lives: this.lives });
        }
    }

    private handleCarCollision(frog: Frog, car: Car) {
        // Decrease lives when the frog hits a car
        this.lives -= 1;
        this.hud.updateLives(this.lives);

        // Reset frog position if lives remain
        if (this.lives > 0) {
            this.frog.resetPosition();
        } else {
            // If no lives are left, go to the game over scene
            this.scene.start('GameOver', { score: this.score, lives: this.lives });
        }
    }
    
    private spawnCars() {
        const yPositions = [200, 300, 400, 500]; // Lane Y positions, but we'll adjust the cars' y position directly
    
        // Loop through each row (yPosition)
        for (let i = 0; i < yPositions.length; i++) {
            // Randomize the speed and direction for the row
            const speed = Phaser.Math.Between(2, 5); // Randomize speed once for the row
            const direction = Phaser.Math.Between(0, 1) === 0 ? 1 : -1; // Randomize direction
    
            // Use the Car.spawnRow method to create cars on this row
            const rowCars = Car.spawnRow(this, yPositions[i], Phaser.Math.Between(1, 3)); // Spawn 1-3 cars
    
            // For all the cars in the row, set the speed and direction (inherited from the first car)
            rowCars.forEach(car => {
                car.speed = speed;
                car.direction = direction;
                car.y = this.cameras.main.height - yPositions[i]; // Place cars at the bottom (near the bottom of the screen)
                this.cars.add(car); // Add each car to the group
            });
        }
    }
    
}
