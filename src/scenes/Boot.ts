import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader,
        //  such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/background.png'); // Background image for Boot scene
        this.load.image('logo', 'assets/logo.png'); // Placeholder for any logo

        // Any other assets needed for the initial scene loading can go here
    }

    create ()
    {
        // Set up the background and any other initial visuals for the Boot scene
        this.add.image(400, 300, 'background'); // Place background image
        this.add.image(400, 150, 'logo'); // Add logo image (adjust position as necessary)

        // Additional boot logic can go here, like animations, transitions, etc.

        // Start the Preloader scene, which will load the game's actual assets
        this.scene.start('Preloader');
    }
}
