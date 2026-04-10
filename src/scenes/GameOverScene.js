class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: 'GameOverScene' }); }

    init(data) {
        this.finalScore  = data.score   || 0;
        this.victory     = data.victory || false;
        this.enemiesKilled = data.enemiesKilled || 0;
    }

    create() {
        const W = CONFIG.ARENA_WIDTH, H = CONFIG.ARENA_HEIGHT;

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75);

        if (this.victory) {
            this._buildVictory(W, H);
        } else {
            this._buildGameOver(W, H);
        }

        // Play again
        const playBtn = this.add.text(W / 2, H / 2 + 130, '[ PLAY AGAIN ]', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px', color: '#f9ca24',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playBtn.on('pointerover',  () => playBtn.setColor('#ffffff'));
        playBtn.on('pointerout',   () => playBtn.setColor('#f9ca24'));
        playBtn.on('pointerdown',  () => this.scene.start('MenuScene'));

        // Blink
        this.tweens.add({
            targets: playBtn, alpha: 0.3,
            duration: 600, yoyo: true, repeat: -1,
        });

        // Space / click to restart
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('MenuScene'));
    }

    _buildVictory(W, H) {
        this.add.text(W / 2, H / 2 - 130, 'VICTORY!', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '44px', color: '#f9ca24',
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 60, 'ALL LEVELS CLEARED', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px', color: '#00e5e5',
        }).setOrigin(0.5);

        this._drawStats(W, H);
    }

    _buildGameOver(W, H) {
        this.add.text(W / 2, H / 2 - 130, 'YOU DIED', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '44px', color: '#e74c3c',
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 60, 'BETTER LUCK NEXT TIME', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px', color: '#888888',
        }).setOrigin(0.5);

        this._drawStats(W, H);
    }

    _drawStats(W, H) {
        this.add.text(W / 2, H / 2 + 10,
            'FINAL SCORE:  ' + this.finalScore.toLocaleString(), {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '13px', color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 + 45,
            'ENEMIES KILLED:  ' + this.enemiesKilled, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px', color: '#aaaaaa',
        }).setOrigin(0.5);
    }
}
