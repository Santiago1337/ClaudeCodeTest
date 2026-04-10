class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }

    create() {
        // Initialise global event bus
        window.GameEvents = new Phaser.Events.EventEmitter();

        // Build all procedural textures once
        TextureFactory.createAll(this);

        this.scene.start('MenuScene');
    }
}
