import { Scene, GameObjects, Physics, Math as PhaserMath, Types } from 'phaser';
import { Car } from './Car';

export class GameLogic extends Scene {
    private frog: Physics.Arcade.Sprite;
    private cars: Phaser.GameObjects.Group;
    private cursors: Types.Input.Keyboard.CursorKeys;
    private gameboard: Phaser.GameObjects.TileSprite;
    private isMoving: boolean = false; // Prevent multiple moves at once
    private tileSize: number = 100; // Size of each tile for row-based movement

    // Define custom world bounds (example)
    private worldBounds: Phaser.Geom.Rectangle;

    constructor() {
        super('GameLogic');
    }

    create() {
        // Define the world bounds (you can adjust these values as needed)
        this.worldBounds = new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Set the world bounds for the game scene
        this.physics.world.bounds = this.worldBounds;

        // Add the gameboard as the background
        this.gameboard = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'gameboard');
        this.gameboard.setOrigin(0, 0);

        // Create the frog player
        this.frog = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.height - 100, 'frog');
        this.frog.setOrigin(0.5, 0.5);
        this.frog.setCollideWorldBounds(true); // Ensure frog stays within the world bounds

        // Define frog animations
        this.createFrogAnimations();

        // Set up input controls for the frog
        this.cursors = this.input.keyboard.createCursorKeys();
        if (!this.cursors) {
            throw new Error('Failed to create cursor keys');
        }

        // Create a group for cars
        this.cars = this.add.group({
            classType: Car,
            maxSize: 10,
            runChildUpdate: true,
        });

        // Add initial cars to the game
        this.createCars();

        // Set up a timer to spawn more cars periodically
        this.time.addEvent({
            delay: 1000,
            callback: this.createCars,
            callbackScope: this,
            loop: true,
        });
    }

    update() {
        if (!this.isMoving) {
            if (this.cursors.up.isDown) {
                this.moveFrog(0, -this.tileSize, 'frog_hop_up', 'frog_idle_up');
            } else if (this.cursors.right.isDown) {
                this.moveFrog(this.tileSize, 0, 'frog_hop_right', 'frog_idle_right');
            } else if (this.cursors.down.isDown) {
                this.moveFrog(0, this.tileSize, 'frog_hop_down', 'frog_idle_down');
            } else if (this.cursors.left.isDown) {
                this.moveFrog(-this.tileSize, 0, 'frog_hop_left', 'frog_idle_left');
            }
        }

        // Handle collisions between frog and cars
        this.physics.world.collide(this.frog, this.cars, this.gameOver, null, this);

        // Keep the frog within the defined world bounds (this also avoids the frog from going off-screen)
        this.frog.setCollideWorldBounds(true);
        if (!this.worldBounds.contains(this.frog.x, this.frog.y)) {
            // Optionally, reset frog's position if it goes outside the world bounds
            this.frog.setPosition(this.cameras.main.centerX, this.cameras.main.height - 100);
        }
    }

    moveFrog(deltaX: number, deltaY: number, hopAnimationKey: string, idleAnimationKey: string) {
        this.isMoving = true;

        const targetX = this.frog.x + deltaX;
        const targetY = this.frog.y + deltaY;

        // Play the hop animation
        this.frog.anims.play(hopAnimationKey, true);

        // Tween the frog to the target position
        this.tweens.add({
            targets: this.frog,
            x: targetX,
            y: targetY,
            duration: 200,
            onComplete: () => {
                this.isMoving = false;
                this.frog.anims.play(idleAnimationKey, true); // Switch back to idle animation
            },
        });
    }

    createFrogAnimations() {
        // Idle animations
        this.anims.create({
            key: 'frog_idle_up',
            frames: [{ key: 'frog', frame: 0 }],
            frameRate: 1,
        });

        this.anims.create({
            key: 'frog_idle_right',
            frames: [{ key: 'frog', frame: 4 }],
            frameRate: 1,
        });

        this.anims.create({
            key: 'frog_idle_down',
            frames: [{ key: 'frog', frame: 4 }],
            frameRate: 1,
        });

        this.anims.create({
            key: 'frog_idle_left',
            frames: [{ key: 'frog', frame: 6 }],
            frameRate: 1,
        });

        // Hop animations
        this.anims.create({
            key: 'frog_hop_up',
            frames: this.anims.generateFrameNumbers('frog', { start: 0, end: 1 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'frog_hop_right',
            frames: this.anims.generateFrameNumbers('frog', { start: 2, end: 3 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'frog_hop_down',
            frames: this.anims.generateFrameNumbers('frog', { start: 4, end: 5 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'frog_hop_left',
            frames: this.anims.generateFrameNumbers('frog', { start: 6, end: 7 }),
            frameRate: 10,
        });
    }

    
    gameOver() {
        // Restart the scene when the frog collides with a car
        this.scene.restart();
    }
}
