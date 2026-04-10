class LevelTransitionScene extends Phaser.Scene {
    constructor() { super({ key: 'LevelTransitionScene' }); }

    init(data) {
        this.completedLevel  = data.level;   // 0-indexed level just beaten
        this.nextLevel       = data.level + 1;
        this.score           = data.score;
        this.enemiesKilled   = data.enemiesKilled || 0;
    }

    create() {
        const W = CONFIG.ARENA_WIDTH, H = CONFIG.ARENA_HEIGHT;

        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.88);

        // "LEVEL X COMPLETE"
        this.add.text(W / 2, H / 2 - 80,
            'LEVEL ' + (this.completedLevel + 1) + ' COMPLETE!', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '26px',
            color: '#f9ca24',
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5);

        // Bonus display
        const bonus = LEVEL_DEFS[this.completedLevel].bonus;
        this.add.text(W / 2, H / 2 - 28,
            '+ ' + bonus.toLocaleString() + ' BONUS', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '13px', color: '#00e5e5',
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 + 10,
            'SCORE: ' + this.score.toLocaleString(), {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px', color: '#ffffff',
        }).setOrigin(0.5);

        // "PREPARE FOR LEVEL X+1"
        const prep = this.add.text(W / 2, H / 2 + 68,
            'PREPARE FOR LEVEL ' + (this.nextLevel + 1), {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px', color: '#aaffaa',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: prep, alpha: 1, duration: 500, delay: 1200,
        });

        // Auto-advance after 3.5 s
        this.time.delayedCall(3500, () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene', {
                    level:         this.nextLevel,
                    score:         this.score,
                    enemiesKilled: this.enemiesKilled,
                });
            });
        });
    }
}
