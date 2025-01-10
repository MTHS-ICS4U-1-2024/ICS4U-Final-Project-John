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
    playerMoveInProgress: boolean = false;

    constructor() {
        super('Game');
    }

    create() {
        // Set up the camera and background
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        // Add the gameboard background and divide it into sections
        this.add.image(512, 60, 'gameboard').setCrop(0, 0, 960, 256); // Goal Area
        this.add.image(512, 180, 'gameboard').setCrop(0, 256, 960, 256); // Water Area
        this.add.image(512, 300, 'gameboard').setCrop(0, 512, 960, 256); // Grass Area
        this.add.image(512, 420, 'gameboard').setCrop(0, 768, 960, 256); // Road Area
        this.add.image(512, 540, 'gameboard').setCrop(0, 1024, 960, 256); // Bottom Grass Area

        // Create the player (frog)
        this.player = this.add.sprite(512, 540, 'frog').setOrigin(0.5);

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create animations
        this.createAnimations();

        // Initialize obstacles
        this.initializeObstacles();

        // Display score and lives
        this.msg_text = this.add.text(16, 16, `Lives: ${this.lives}  Score: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });
    }

    update() {
        this.handlePlayerMovement();
    
        // Check if the frog reaches the goal area
        if (this.player.y <= 60) {
            this.handleGoalReach();
        }
    
        // Update collisions manually
        this.checkCollisions();
    }
    
    handlePlayerMovement() {
        if (this.playerMoveInProgress) return;  // Prevent overlapping movements
        
        // Handle movement with arrow keys
        if (this.cursors.up.isDown) {
            this.movePlayer(0, -40);  // Move the player upwards
        } else if (this.cursors.down.isDown) {
            this.movePlayer(0, 40);  // Move the player downwards
        } else if (this.cursors.left.isDown) {
            this.movePlayer(-40, 0);  // Move the player left
        } else if (this.cursors.right.isDown) {
            this.movePlayer(40, 0);  // Move the player right
        }
    }
    
    movePlayer(xOffset: number, yOffset: number) {
        this.playerMoveInProgress = true;
        this.tweens.add({
            targets: this.player,
            x: this.player.x + xOffset,
            y: this.player.y + yOffset,
            duration: 200,
            onComplete: () => {
                this.playerMoveInProgress = false;
                this.player.play('frog_hop', true);
                this.checkForScoring();
            }
        });
    }

    checkForScoring() {
        // Update score when moving up
        if (this.player.y <= 60) {
            this.handleGoalReach();
        }
    }

    initializeObstacles() {
        this.rows = [
            {
                top: 180,
                obstacles: [
                    { type: 'log', x: 100, speed: 100, direction: 'RIGHT' },
                    { type: 'turtle', x: 300, speed: 50, direction: 'LEFT', isVisible: true },
                    { type: 'turtle', x: 700, speed: 50, direction: 'LEFT', isVisible: true },
                ],
            },
            {
                top: 420,
                obstacles: [
                    { type: 'car', x: 300, speed: 200, direction: 'RIGHT' },
                    { type: 'car', x: 800, speed: 150, direction: 'LEFT' },
                ],
            },
        ];

        this.rows.forEach((row) => {
            row.obstacles.forEach((obstacle) => {
                const sprite = this.add.sprite(obstacle.x, row.top, obstacle.type);
                obstacle.sprite = sprite;

                if (obstacle.type === 'turtle') {
                    const willDive = Phaser.Math.Between(0, 1) === 1;

                    if (willDive) {
                        this.time.addEvent({
                            delay: Phaser.Math.Between(2000, 5000), // Random interval for diving
                            callback: () => {
                                obstacle.isVisible = !obstacle.isVisible;
                                sprite.setAlpha(obstacle.isVisible ? 1 : 0);
                            },
                            loop: true,
                        });
                    }
                }
            });
        });
    }

    checkCollisions() {
        this.rows.forEach((row) => {
            row.obstacles.forEach((obstacle) => {
                const sprite = obstacle.sprite;
                if (
                    this.player.y === sprite.y &&
                    Math.abs(this.player.x - sprite.x) < 32 &&
                    (obstacle.isVisible === undefined || obstacle.isVisible)
                ) {
                    this.handleCollision(obstacle);
                }
            });
        });
    }

    handleCollision(obstacle: any) {
        this.lives -= 1;
        this.msg_text.setText(`Lives: ${this.lives}  Score: ${this.score}`);

        this.player.play('frog_dead', true);
        this.time.delayedCall(1000, () => {
            if (this.lives <= 0) {
                this.scene.start('GameOver');
            } else {
                this.player.setPosition(512, 540);
                this.furthestRow = 700;
            }
        });
    }

    handleGoalReach() {
        this.score += 500 + this.timeBonus;
        this.msg_text.setText(`Lives: ${this.lives}  Score: ${this.score}`);

        this.player.setPosition(512, 540);
        this.furthestRow = 700;
        this.timeBonus = 2000;
    }

    createAnimations() {
        this.anims.create({
            key: 'frog_hop',
            frames: this.anims.generateFrameNumbers('frog', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'frog_dead',
            frames: this.anims.generateFrameNumbers('frog_dead', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'turtle_dive',
            frames: this.anims.generateFrameNumbers('turtle_dive', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1,
        });
    }
}
