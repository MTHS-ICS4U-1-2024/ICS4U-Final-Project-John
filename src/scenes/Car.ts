import { Scene } from 'phaser';

export class Car extends Phaser.GameObjects.Sprite {
    private speed: number; // Speed of the car
    private direction: number; // 1 for right, -1 for left

    constructor(scene: Scene, x: number, y: number, texture: string, speed: number, direction: number) {
        super(scene, x, y, texture);

        // Add the car to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = speed;
        this.direction = direction;

        // Set origin and scaling, if needed
        this.setOrigin(0.5);
    }

    update() {
        // Move the car in its direction
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
}
