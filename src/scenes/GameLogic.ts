import { Scene, GameObjects, Physics, Math as PhaserMath, Types } from 'phaser';

export class GameLogic extends Scene {
    private frog: GameObjects.Sprite;
    private cars: Phaser.GameObjects.Group;
    private cursors: Types.Input.Keyboard.CursorKeys;
    private gameboard: Phaser.GameObjects.TileSprite;
    private carSpeed: number = 100; // Adjust car speed
    private isMoving: boolean = false; // Prevent multiple moves at once
    private tileSize: number = 50; // Size of each tile for movement

    constructor() {
        super('GameLogic');
    }

    preload() {
        // Load assets
        this.load.image('frog', 'assets/frog.png');
        this.load.image('car', 'assets/car.png');
        this.load.image('gameboard', 'assets/gameboard.png');
    }

    create() {
        // Add the gameboard as the background
        this.gameboard = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'gameboard');
        this.gameboard.setOrigin(0, 0);

        // Create the frog player
        this.frog = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.height - 100, 'frog');
        this.frog.setOrigin(0.5, 0.5);
        this.frog.setCollideWorldBounds(true); // Ensure frog stays within the world bounds

        // Set up input controls for the frog
        this.cursors = this.input.keyboard.createCursorKeys();
        if (!this.cursors) {
            throw new Error('Failed to create cursor keys');
        }

        // Create cars and add them to a group
        this.cars = this.add.group({
            classType: Physics.Arcade.Sprite,
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
        // Handle frog tile-based movement
        if (!this.isMoving) {
            if (this.cursors.left.isDown) {
                this.moveFrog(-this.tileSize, 0); // Move left by one tile
            } else if (this.cursors.right.isDown) {
                this.moveFrog(this.tileSize, 0); // Move right by one tile
            } else if (this.cursors.up.isDown) {
                this.moveFrog(0, -this.tileSize); // Move up by one tile
            } else if (this.cursors.down.isDown) {
                this.moveFrog(0, this.tileSize); // Move down by one tile
            }
        }

        // Update car movements
        this.cars.children.iterate((car: Physics.Arcade.Sprite) => {
            if (car.x < 0 || car.x > this.cameras.main.width) {
                car.setActive(false).setVisible(false); // Hide cars that go off-screen
            }
        });

        // Handle collisions between frog and cars
        this.physics.world.collide(this.frog, this.cars, this.gameOver, null, this);
    }

    moveFrog(deltaX: number, deltaY: number) {
        // Ensure only one move at a time
        this.isMoving = true;

        // Calculate the target position
        const targetX = this.frog.x + deltaX;
        const targetY = this.frog.y + deltaY;

        // Tween the frog to the target position
        this.tweens.add({
            targets: this.frog,
            x: targetX,
            y: targetY,
            duration: 200, // Movement duration in milliseconds
            onComplete: () => {
                this.isMoving = false; // Allow further movement after tween is complete
            },
        });
    }

    createCars() {
        // Add cars moving from right to left
        const car = this.physics.add.sprite(this.cameras.main.width, PhaserMath.Between(50, this.cameras.main.height - 50), 'car');
        car.setOrigin(0.5, 0.5);
        car.setScale(0.5);
        car.setVelocityX(-this.carSpeed);
        this.cars.add(car);
    }

    gameOver() {
        // Handle game over logic
        this.scene.restart(); // Restart the scene when the frog collides with a car
    }
}
