import { Scene } from 'phaser';

export class Car extends Phaser.GameObjects.Sprite {
    private speed: number; // Speed of the car
    private direction: number; // 1 for right, -1 for left
    private yPosition: number; // The Y position (lane) of the car
    private minSpacing: number = 100; // Minimum spacing between cars
    private rowCars: Car[] = []; // All cars in this row (including the first car)

    constructor(scene: Scene, x: number, y: number, texture: string, speed: number, direction: number) {
        super(scene, x, y, texture);

        // Add the car to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = speed;
        this.direction = direction;
        this.yPosition = y; // Store the Y position (lane)

        // Set origin and scaling, if needed
        this.setOrigin(0.5);

        // Add this car to the row's list
        this.rowCars.push(this);
    }

    update() {
        // Move the car in its direction (the same as the first car in the row)
        this.x += this.speed * this.direction;

        // Reset car position if it moves out of the screen
        this.checkBounds();
    }

    private checkBounds() {
        const sceneWidth = this.scene.cameras.main.width;

        if (this.x > sceneWidth + this.width && this.direction === 1) {
            // Car moving right goes off the screen
            this.x = -this.width; // Reset to the left side
            this.resetRowCars(); // Reset the whole row, following the first car
        } else if (this.x < -this.width && this.direction === -1) {
            // Car moving left goes off the screen
            this.x = sceneWidth + this.width; // Reset to the right side
            this.resetRowCars(); // Reset the whole row, following the first car
        }
    }

    private resetRowCars() {
        // Randomize speed and direction for the first car only
        if (this.rowCars[0] === this) {
            this.speed = Phaser.Math.Between(2, 5); // Randomize speed for the first car
            this.direction = Phaser.Math.Between(0, 1) === 0 ? 1 : -1; // Randomize direction for the first car
        }

        // Update position and motion for the entire row
        this.rowCars.forEach((car, index) => {
            const startX = this.direction === 1 ? -50 : this.scene.cameras.main.width + 50;
            const totalSpacing = (this.rowCars.length - 1) * this.minSpacing; // Calculate total space needed for the cars
            car.x = startX + (index * this.minSpacing); // Adjust position based on index and direction
            car.y = this.yPosition; // Keep Y-position fixed for all cars in the row
            car.speed = this.speed; // Set all cars to have the same speed
            car.direction = this.direction; // Set all cars to have the same direction
        });
    }

    public static spawnRow(scene: Scene, yPosition: number, numCars: number): Car[] {
        // Create a row of cars at a fixed Y-position near the bottom of the screen
        const rowCars: Car[] = [];
        const firstCarX = scene.cameras.main.width / 2; // Use center X position for the first car
        let direction = Phaser.Math.Between(0, 1) === 0 ? 1 : -1; // Randomize direction for the row
        const speed = Phaser.Math.Between(2, 5); // Randomize speed for the row

        // Ensure the yPosition is at the bottom of the screen or slightly above
        const bottomYPosition = scene.cameras.main.height - yPosition;

        for (let i = 0; i < numCars; i++) {
            const car = new Car(
                scene,
                firstCarX + (i * 100 * direction), // Position the cars in a row with fixed spacing
                bottomYPosition, // Place cars at a fixed Y-position near the bottom
                'car',
                speed,
                direction
            );
            rowCars.push(car);
        }

        return rowCars;
    }
}
