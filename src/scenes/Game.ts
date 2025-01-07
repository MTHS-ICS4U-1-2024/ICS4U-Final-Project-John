import { Scene, GameObjects, Physics } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;

    // Store rows and obstacles
    rows: any[] = [];

    // Variables for game state
    lives: number = 3;
    score: number = 0;

    constructor() {
        super('Game');
    }

    preload() {
        // Load necessary assets for the game
        this.load.image('background', 'assets/bg.png');
        this.load.image('frog', 'assets/frog.png');
        this.load.image('log', 'assets/log.png');
        this.load.image('car', 'assets/car.png');
        this.load.image('goal', 'assets/goal.png');
        this.load.image('road', 'assets/road.png'); 
        this.load.image('water', 'assets/water.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('turtle', 'assets/turtle.png');
    }

    create() {
        // Set up the camera and background
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        // Background sections
        this.add.image(512, 100, 'grass');  // Grass section
        this.add.image(512, 300, 'water');  // Water section
        this.add.image(512, 500, 'road');   // Road section

        // Create the player (frog)
        this.player = this.add.sprite(512, 600, 'frog');
        this.player.setOrigin(0.5);

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Initialize obstacles (rows of obstacles)
        this.initializeObstacles();

        // Display score and lives
        this.msg_text = this.add.text(16, 16, `Lives: ${this.lives}  Score: ${this.score}`, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 4
        });

        // Start checking collisions
        this.time.addEvent({
            delay: 1000 / 60, // 60 FPS check
            callback: this.checkCollisions,
            loop: true,
            callbackScope: this
        });
    }

    update() {
        // Handle player movement (frog)
        this.handlePlayerMovement();
    }

    handlePlayerMovement() {
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.player.x += 5;
        } else if (this.cursors.up.isDown) {
            this.player.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.player.y += 5;
        }
    }

    initializeObstacles() {
        // Define rows of obstacles (moving objects like cars, logs, turtles)
        this.rows = [
            // Row 1 (Logs and Turtles moving to both left and right)
            {
                top: 300, // Y position (water area)
                direction: 'BOTH', // Both directions
                speed: 2,
                obstacles: [
                    { type: 'log', x: 100, y: 300, speed: 2, direction: 'RIGHT' },
                    { type: 'log', x: 1200, y: 300, speed: 2, direction: 'LEFT' },
                    { type: 'turtle', x: 700, y: 300, speed: 1, isVisible: true, direction: 'RIGHT' },
                    { type: 'turtle', x: 1000, y: 300, speed: 1, isVisible: true, direction: 'LEFT' }
                ]
            },
            {
                top: 500, // Row with cars moving to both left and right (road area)
                direction: 'BOTH',
                speed: 3,
                obstacles: [
                    { type: 'car', x: 800, y: 500, speed: 3, direction: 'LEFT' },
                    { type: 'car', x: 1100, y: 500, speed: 3, direction: 'RIGHT' }
                ]
            }
        ];

        // Create obstacles and move them
        this.rows.forEach(row => {
            row.obstacles.forEach(obstacle => {
                let sprite;
                if (obstacle.type === 'log' || obstacle.type === 'car') {
                    sprite = this.add.sprite(obstacle.x, row.top, obstacle.type);
                    this.physics.world.enable(sprite);
                    sprite.setVelocityX(obstacle.direction === 'RIGHT' ? obstacle.speed : -obstacle.speed);
                } else if (obstacle.type === 'turtle') {
                    sprite = this.add.sprite(obstacle.x, row.top, 'turtle');
                    this.physics.world.enable(sprite);
                    sprite.setVelocityX(obstacle.direction === 'RIGHT' ? obstacle.speed : -obstacle.speed);

                    // Toggle visibility for turtles randomly
                    this.time.addEvent({
                        delay: Phaser.Math.Between(1000, 2000),
                        callback: () => {
                            obstacle.isVisible = !obstacle.isVisible;
                            sprite.setAlpha(obstacle.isVisible ? 1 : 0);
                        },
                        loop: true
                    });
                }
            });
        });
    }

    checkCollisions() {
        // Check if the frog collides with any obstacles
        this.rows.forEach(row => {
            row.obstacles.forEach(obstacle => {
                if (this.player.getBounds().intersects(obstacle.getBounds())) {
                    if (obstacle.type === 'turtle' && !obstacle.isVisible) {
                        // Player loses a life if standing on a turtle that goes into the water
                        this.handleCollision();
                    } else if (obstacle.type !== 'turtle') {
                        // Handle collision with cars and logs
                        this.handleCollision();
                    }
                }
            });
        });
    }

    handleCollision() {
        // Decrease lives if a collision occurs
        this.lives -= 1;
        this.msg_text.setText(`Lives: ${this.lives}  Score: ${this.score}`);
        
        if (this.lives <= 0) {
            this.scene.start('GameOver');
        }
    }

    // You can add functions for detecting goal completion and scoring here as well
    handleGoalReach() {
        // Example for checking if the frog reaches a goal
        this.score += 100;
        this.msg_text.setText(`Lives: ${this.lives}  Score: ${this.score}`);
    }
}
