import { Scene } from 'phaser';

export class Frog extends Phaser.GameObjects.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys; // For handling input

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add the frog to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up input keys
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Set origin and scale, if needed
        this.setOrigin(0.5);
    }

    update() {
        // Handle movement
        if (this.cursors.left.isDown) {
            this.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.x += 5;
        }

        if (this.cursors.up.isDown) {
            this.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.y += 5;
        }

        // Handle boundaries
        this.checkBoundaries();
    }

    private checkBoundaries() {
        // Keep the frog within the scene boundaries
        const { width, height } = this.scene.cameras.main;
        this.x = Phaser.Math.Clamp(this.x, 0, width);
        this.y = Phaser.Math.Clamp(this.y, 0, height);
    }

    hasReachedGoal(): boolean {
        // Check if the frog has reached the goal (e.g., top of the screen)
        return this.y <= 0;
    }

    resetPosition() {
        // Reset the frog's position to the starting point
        this.setPosition(this.scene.cameras.main.centerX, this.scene.cameras.main.height - 100);
    }
}
