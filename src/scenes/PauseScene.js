class PauseScene extends Phaser.Scene {
    constructor() { super({ key: 'PauseScene' }); }

    create() {
        const W = CONFIG.ARENA_WIDTH, H = CONFIG.ARENA_HEIGHT;

        // Dim overlay
        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.65);

        this.add.text(W / 2, H / 2 - 70, 'PAUSED', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '40px',
            color: '#00e5e5',
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5);

        const resumeTxt = this.add.text(W / 2, H / 2 + 20, '[ PRESS ESC TO RESUME ]', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: '#f9ca24',
        }).setOrigin(0.5);

        this.tweens.add({
            targets: resumeTxt, alpha: 0.2,
            duration: 600, yoyo: true, repeat: -1,
        });

        this.add.text(W / 2, H / 2 + 60, '[ M ] MAIN MENU', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px', color: '#aaaaaa',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this._goMenu());

        // ESC resumes
        this.input.keyboard.on('keydown-ESC', () => this._resume());

        // M goes to menu
        this.input.keyboard.on('keydown-M', () => this._goMenu());
    }

    _resume() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    _goMenu() {
        this.scene.stop('HUDScene');
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}
