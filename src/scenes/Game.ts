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

    // Goal area positions (updated with the new coordinates)
    private goalPositions: { x: number, y: number }[] = [
        { x: 55, y: 175 },
        { x: 255, y: 175 },
        { x: 462, y: 175 },
        { x: 665, y: 175 },
        { x: 868, y: 175 }
    ];

    private lastRow: number; // Track the highest row the frog has reached
    private startTime: number; // Track the start time for awarding time bonuses
    private rowsCrossed: number; // Track rows crossed before reaching a goal

    constructor() {
        super('Game');
    }

    create() {
        // Initialize variables
        this.score = 0;
        this.lives = 3; // Starting lives
        this.gameOver = false;
        this.lastRow = this.cameras.main.height - 100;
        this.startTime = this.time.now; // Start tracking time
        this.rowsCrossed = 0;

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

        // Draw the goal areas as red squares for visibility
        this.drawGoalAreas();
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Update the frog
        const movedUp = this.frog.update();

        if (movedUp) {
            const currentRow = this.frog.y;

            // Check if the frog moved to a new row
            if (currentRow < this.lastRow) {
                this.score += 10; // Award 10 points for moving up a new row
                this.rowsCrossed += 1; // Increment rows crossed
                this.lastRow = currentRow; // Update the highest row reached
            }
        }

        // Update the score and lives in the HUD
        this.hud.updateScore(this.score);
        this.hud.updateLives(this.lives);

        // Update all cars
        this.cars.children.iterate((car: Car) => {
            car.update();
        });
    }

    private drawGoalAreas() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xFF0000, 1); // Red color

        // Loop through each goal position and draw a square (size 40x40)
        this.goalPositions.forEach((pos) => {
            graphics.fillRect(pos.x, pos.y, 40, 40); // Draw a square of size 40x40
        });
    }

    private checkGameOver() {
        // Check if the frog has reached one of the goal areas
        if (this.frog.hasReachedGoal(this.goalPositions)) {
            const timeElapsed = (this.time.now - this.startTime) / 1000; // Time in seconds
            const timeBonus = Math.floor((30 - timeElapsed) / 10) * 5; // Award 5 points for every 10 seconds saved
            const scoreMultiplier = this.rowsCrossed; // Multiply score by rows crossed

            // Update score
            this.score += timeBonus + this.rowsCrossed * scoreMultiplier;

            // Reset rows crossed and start time
            this.frog.resetPosition();
            this.lastRow = this.cameras.main.height - 100; // Reset the highest row
            this.startTime = this.time.now; // Reset timer
            this.rowsCrossed = 0; // Reset rows crossed
        }

        // If the frog's lives are 0, end the game
        if (this.lives <= 0) {
            this.gameOver = true;

            // Go to GameOver scene with restart logic
            this.scene.start('GameOver', { score: this.score, onRestart: () => this.resetGame() });
        }
    }

    private resetGame() {
        // Reset score, lives, and game over state
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;

        // Reset frog's position
        this.frog.resetPosition();

        // Remove all existing cars and respawn them
        this.cars.clear(true, true);
        this.spawnCars();

        // Reset HUD (calls a method from Hud scene)
        const hudScene = this.scene.get('Hud') as Hud;
        hudScene.resetHud();
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
