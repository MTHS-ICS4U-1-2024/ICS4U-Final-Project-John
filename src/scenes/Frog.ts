import { Scene } from 'phaser';

export class Frog extends Phaser.GameObjects.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys; // For handling input
    private isMoving: boolean; // Flag to ensure single movement per key press
    private rowHeight: number = 100; // Height of each lane/row (adjust as needed)

    // Define goal areas as an array of objects with x and y positions
    private goalAreas: { x: number, y: number }[] = [
        { x: 55, y: 175 },
        { x: 255, y: 175 },
        { x: 462, y: 175 },
        { x: 665, y: 175 },
        { x: 868, y: 175 }
    ];

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add the frog to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up input keys
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Initialize movement flag
        this.isMoving = false;

        // Set origin and scale, if needed
        this.setOrigin(0.5);
    }

    update() {
        // Handle movement, ensuring one movement per key press
        if (!this.isMoving) {
            if (this.cursors.up.isDown) {
                this.isMoving = true;
                this.y -= this.rowHeight; // Move up one row
            } else if (this.cursors.down.isDown) {
                this.isMoving = true;
                this.y += this.rowHeight; // Move down one row
            } else if (this.cursors.left.isDown) {
                this.isMoving = true;
                this.x -= this.rowHeight; // Move left one lane (same width as row height)
            } else if (this.cursors.right.isDown) {
                this.isMoving = true;
                this.x += this.rowHeight; // Move right one lane (same width as row height)
            }
        }

        // Reset movement flag when no keys are pressed
        if (
            Phaser.Input.Keyboard.JustUp(this.cursors.up) ||
            Phaser.Input.Keyboard.JustUp(this.cursors.down) ||
            Phaser.Input.Keyboard.JustUp(this.cursors.left) ||
            Phaser.Input.Keyboard.JustUp(this.cursors.right)
        ) {
            this.isMoving = false;
        }

        // Handle boundaries
        this.checkBoundaries();
    }

    private checkBoundaries() {
        // Keep the frog within the scene boundaries
        const { width, height } = this.scene.cameras.main;
        this.x = Phaser.Math.Clamp(this.x, 0, width);
        this.y = Phaser.Math.Clamp(this.y, 0, height - this.rowHeight); // Prevent going off the top
    }

    hasReachedGoal(): boolean {
        // Check if the frog is within any of the defined goal areas
        return this.goalAreas.some(goal => 
            this.x >= goal.x && this.x <= goal.x + 40 && // Check if the frog's x is within the goal's bounds
            this.y >= goal.y && this.y <= goal.y + 100 // Check if the frog's y is within the goal's bounds
        );
    }

    resetPosition() {
        // Reset the frog's position to the starting point
        this.setPosition(this.scene.cameras.main.centerX, this.scene.cameras.main.height - this.rowHeight);
    }
}
