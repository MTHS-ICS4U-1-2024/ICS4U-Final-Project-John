import { Scene, GameObjects, Physics } from 'phaser';

export class GameLogic extends Scene {
    private frog: GameObjects.Sprite;
    private cars: Phaser.GameObjects.Group;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private gameboard: Phaser.GameObjects.TileSprite;
    private carSpeed: number = 100; // Adjust car speed

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
        this.frog = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height - 100, 'frog');
        this.frog.setOrigin(0.5, 0.5);
        this.frog.setCollideWorldBounds(true); // Ensure frog stays within the world bounds

        // Set up input controls for the frog
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create cars and add them to a group
        this.cars = this.add.group({
            classType: GameObjects.Sprite,
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
        // Handle frog movement
        if (this.cursors.left.isDown) {
            this.frog.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.frog.x += 5;
        } else if (this.cursors.up.isDown) {
            this.frog.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.frog.y += 5;
        }

        // Update car movements
        this.cars.children.iterate((car: GameObjects.Sprite) => {
            if (car.x < 0 || car.x > this.cameras.main.width) {
                car.setActive(false).setVisible(false); // Hide cars that go off-screen
            }
        });

        // Handle collisions between frog and cars
        this.physics.world.collide(this.frog, this.cars, this.gameOver, null, this);
    }

    createCars() {
        // Add cars moving from right to left
        const car = this.add.sprite(this.cameras.main.width, Phaser.Math.Between(50, this.cameras.main.height - 50), 'car');
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
