import { Scene } from 'phaser';

export class Car extends Phaser.GameObjects.Sprite {
    private speed: number; // Speed of the car
    private direction: number; // 1 for right, -1 for left
    private yPosition: number; // The Y position (lane) of the car
 
    constructor(scene: Scene, x: number, y: number, texture: string, speed:number, direction:number){
        super(scene, x, y, texture);

        // Add the car to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Assign the global direction and speed
        this.speed = speed;
        this.direction = direction;
        this.yPosition = y;

        // Set origin and scaling, if needed
        this.setOrigin(0.5);
    }

    update() {
        // Move the car in its global direction
        this.x += this.speed * this.direction;

        // Reset car position if it moves out of the screen
        this.checkBounds();
    }

    private checkBounds() {
        const sceneWidth = this.scene.cameras.main.width;

        if (this.x > sceneWidth + this.width && this.direction === 1) {
            // Car moving right goes off the screen
            this.x = -this.width; // Reset to the left side
        } else if (this.x < -this.width && this.direction === -1) {
            // Car moving left goes off the screen
            this.x = sceneWidth + this.width; // Reset to the right side
        }
    }

    public static spawnRow(scene: Scene, yPosition: number, numCars: number): Car[] {
        const rowCars: Car[] = [];
        const direction = Phaser.Math.Between(0, 1) === 0 ? 1 : -1; // Randomize direction
        const speed = Phaser.Math.Between(2, 5); // Randomize speed for the first car

        const firstCarX = direction === 1 ? -50 : scene.cameras.main.width + 50; // Start position based on direction
        const spacing = 300; // Fixed spacing between cars

        for (let i = 0; i < numCars; i++) {
            const car = new Car(
                scene,
                firstCarX + (i * spacing * direction), // Position cars with fixed spacing
                yPosition, // Fixed Y-position for the row
                'car',
                speed, // Use the randomized speed for all cars in this row
                direction // Use the same direction for all cars in this row
            );
            rowCars.push(car);
        }

        return rowCars;
    }
}