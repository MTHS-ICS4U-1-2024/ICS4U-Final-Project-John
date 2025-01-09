import { Scene, Types } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Sprite;
    cursors: Types.Input.Keyboard.CursorKeys;
    timeBonus: number = 2000;
    furthestRow: number = 700;
    rows: any[] = [];
    lives: number = 3;
    score: number = 0;

    constructor() {
        super('Game');
    }

    create() {
        // Set up the camera and background
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        // Add the gameboard background and divide it into sections
        this.add.image(512, 60, 'gameboard').setCrop(0, 0, 960, 256); // Goal Area (top part)
        this.add.image(512, 180, 'gameboard').setCrop(0, 256, 960, 256); // Water Area
        this.add.image(512, 300, 'gameboard').setCrop(0, 512, 960, 256); // Grass Area (Safe spots)
        this.add.image(512, 420, 'gameboard').setCrop(0, 768, 960, 256); // Road Area (where cars are)
        this.add.image(512, 540, 'gameboard').setCrop(0, 1024, 960, 256); // Bottom Grass Area (Safe spots)

        // Create the player (frog)
        this.player = this.add.sprite(512, 540, 'frog').setOrigin(0.5);

        // Add a timer event to decrease the time bonus
        this.time.addEvent({
            delay: 100, // Decrease bonus every 100ms
            callback: () => {
                if (this.timeBonus > 0) this.timeBonus -= 1;
            },
            loop: true
        });

        // Set up keyboard controls
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Frog Hopping Animation
        this.anims.create({
            key: 'frog_hop',
            frames: this.anims.generateFrameNumbers('frog_hop', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0 // Play once per input
        });

        // Frog Dying Animation
        this.anims.create({
            key: 'frog_dead',
            frames: this.anims.generateFrameNumbers('frog_dead', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        // Turtle Diving Animation
        this.anims.create({
            key: 'turtle_dive',
            frames: this.anims.generateFrameNumbers('turtle_dive', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1 // Loop the animation
        });

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
        this.handlePlayerMovement();
        this.handleGoalReach(); // Check if the frog reached the goal

        if (this.timeBonus > 0) this.timeBonus -= 1; {
            this.handleCollision(); // Lose a life
            this.timeBonus = 2000; // Reset time bonus
            this.player.setPosition(512, 540); // Reset position
            this.furthestRow = 700; // Reset progress
        }
    }
    

    handlePlayerMovement() {
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
            this.player.play('frog_hop', true); // Play hopping animation
        } else if (this.cursors.right.isDown) {
            this.player.x += 5;
            this.player.play('frog_hop', true);
        } else if (this.cursors.up.isDown) {
            this.player.y -= 5;
            this.player.play('frog_hop', true);
        } else if (this.cursors.down.isDown) {
            this.player.y += 5;
            this.player.play('frog_hop', true);
        }
    }

    initializeObstacles() {
        // Define rows of obstacles (moving objects like cars, logs, turtles)
        this.rows = [
            {
                top: 180, // Y position (Water Area)
                direction: 'BOTH', 
                speed: 2,
                obstacles: [
                    { type: 'log', x: 100, y: 180, speed: 2, direction: 'RIGHT' },
                    { type: 'log', x: 1200, y: 180, speed: 2, direction: 'LEFT' },
                    { type: 'turtle', x: 700, y: 180, speed: 1, isVisible: true, direction: 'RIGHT' },
                    { type: 'turtle', x: 1000, y: 180, speed: 1, isVisible: true, direction: 'LEFT' }
                ]
            },
            {
                top: 420, // Y position (Road Area)
                direction: 'BOTH',
                speed: 3,
                obstacles: [
                    { type: 'car', x: 800, y: 420, speed: 3, direction: 'LEFT' },
                    { type: 'car', x: 1100, y: 420, speed: 3, direction: 'RIGHT' }
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
                this.physics.world.overlap(this.player, obstacle, () => {
                    if (obstacle.type === 'turtle' && !obstacle.isVisible) {
                        // Player loses a life if standing on a turtle that goes into the water
                        this.handleCollision();
                    } else if (obstacle.type !== 'turtle') {
                        // Handle collision with cars and logs
                        this.handleCollision();
                    }
                });
            });
        });
    }

    handleCollision() {
        this.player.play('frog_dead', true); // Play dying animation
    
        // Add a slight delay before resetting position
        this.time.delayedCall(1000, () => {
            this.lives -= 1;
            this.registry.set('lives', this.lives); // Store lives in registry
            this.registry.set('score', this.score); // Store score in registry
    
            this.msg_text.setText(`Lives: ${this.lives}  Score: ${this.score}`);
    
            if (this.lives <= 0) {
                this.scene.start('GameOver'); // Transition to GameOver scene
            } else {
                // Reset player position
                this.player.setPosition(512, 540);
            }
        });
    }
    
    handleGoalReach() {
        if (this.player.y <= 60) { // Goal area (top part of the screen)
            this.score += 500; // Base goal score
            this.score += this.timeBonus; // Add time bonus
            this.registry.set('score', this.score); // Store score in registry
            this.registry.set('lives', this.lives); // Store lives in registry
            this.msg_text.setText(`Lives: ${this.lives}  Score: ${this.score}`);
    
            // Reset for the next round
            this.player.setPosition(512, 540);
            this.furthestRow = 700;
            this.timeBonus = 2000; // Reset time bonus
        }
    }
}
