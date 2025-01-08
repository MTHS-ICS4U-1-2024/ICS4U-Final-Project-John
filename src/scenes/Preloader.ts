import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Display a background image (optional, loaded in the Boot scene)
        this.add.image(512, 384, 'background');

        // A simple progress bar outline
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // Progress bar itself
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // Update the progress bar width based on loading progress
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        // Set the path for assets
        this.load.setPath('assets');

        // Load general assets
        this.load.image('logo', 'logo.png');
        this.load.image('background', 'bg.png');
        this.load.image('frog', 'frog.png');
        this.load.image('log', 'log.png');
        this.load.image('car', 'car.png');
        this.load.image('goal', 'goal.png');
        this.load.image('road', 'road.png');
        this.load.image('water', 'water.png');
        this.load.image('grass', 'grass.png');
        this.load.image('turtle', 'turtle.png');

        // Load spritesheets for animations
        this.load.spritesheet('frog_hop', 'frog_hop.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('frog_dead', 'frog_dead.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('turtle_dive', 'turtle_dive.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // Transition to the MainMenu scene after assets are loaded
        this.scene.start('MainMenu');
    }
}
