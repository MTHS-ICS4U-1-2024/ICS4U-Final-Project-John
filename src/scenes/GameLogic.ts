import { Scene, GameObjects, Physics, Math as PhaserMath, Types } from 'phaser';
import { Car } from './Car';

export class GameLogic extends Scene {
    private frog: Physics.Arcade.Sprite;
    private cars: Phaser.GameObjects.Group;
    private cursors: Types.Input.Keyboard.CursorKeys;
    private gameboard: Phaser.GameObjects.TileSprite;
    private carSpeed: number = 100; // Adjust car speed
    private isMoving: boolean = false; // Prevent multiple moves at once
    private tileSize: number = 50; // Size of each tile for movement

    constructor() {
        super('GameLogic');
    }

    create() {
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
            frames: [{ key: 'frog', frame: 2 }],
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

    createCars() {
        // Spawn cars closer to the frog's starting position
        const minY = this.cameras.main.height - 200; // Lower limit closer to the frog
        const maxY = this.cameras.main.height - 50; // Upper limit closer to the frog
        const y = PhaserMath.Between(minY, maxY);

        // Randomize speed and direction
        const speed = PhaserMath.Between(50, this.carSpeed);
        const direction = PhaserMath.Between(0, 1) === 0 ? -1 : 1;

        // Create a new car
        const car = new Car(this, direction === 1 ? -50 : this.cameras.main.width + 50, y, 'car', speed, direction);
        car.setScale(0.5); // Optional scaling
        this.cars.add(car);
    }

    gameOver() {
        // Restart the scene when the frog collides with a car
        this.scene.restart();
    }
}
