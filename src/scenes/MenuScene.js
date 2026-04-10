class MenuScene extends Phaser.Scene {
    constructor() { super({ key: 'MenuScene' }); }

    create() {
        const W = CONFIG.ARENA_WIDTH, H = CONFIG.ARENA_HEIGHT;

        // Background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // Drifting ghost enemies for atmosphere
        this._spawnGhosts();

        // Title shadow
        this.add.text(W / 2 + 3, 118, 'NEON ASSAULT', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '36px',
            color: '#000033',
        }).setOrigin(0.5);

        // Title
        this.add.text(W / 2, 115, 'NEON ASSAULT', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '36px',
            color: '#00e5e5',
            stroke: '#003333',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(W / 2, 168, 'TOP-DOWN SHOOTER', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            color: '#6ecfcf',
        }).setOrigin(0.5);

        // Divider
        this.add.rectangle(W / 2, 195, 400, 2, 0x00b5b5);

        // Enemy legend
        this._drawLegend(W / 2, 240);

        // Controls
        this._drawControls(W / 2, 370);

        // Blinking "CLICK TO START"
        const startText = this.add.text(W / 2, 490, '— CLICK TO START —', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#f9ca24',
        }).setOrigin(0.5);

        this.tweens.add({
            targets:  startText,
            alpha:    0,
            duration: 550,
            yoyo:     true,
            repeat:   -1,
        });

        // Version
        this.add.text(W - 8, H - 8, 'v1.0', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#334455',
        }).setOrigin(1, 1);

        // Click / space to start
        this.input.once('pointerdown', () => this.scene.start('GameScene'));
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    }

    _drawLegend(cx, y) {
        const entries = [
            { key: 'enemy_grunt',  label: 'GRUNT  –  100 pts',  sub: '2 HP  /  MED' },
            { key: 'enemy_rusher', label: 'RUSHER – 150 pts',   sub: '1 HP  /  FAST' },
            { key: 'enemy_tank',   label: 'TANK   – 300 pts',   sub: '6 HP  /  SLOW' },
        ];
        this.add.text(cx, y - 22, 'ENEMY TYPES', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '9px', color: '#aaaaaa',
        }).setOrigin(0.5);

        entries.forEach((e, i) => {
            const row = y + 10 + i * 38;
            this.add.image(cx - 155, row, e.key).setScale(1.4);
            this.add.text(cx - 130, row - 8, e.label, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px', color: '#dddddd',
            });
            this.add.text(cx - 130, row + 6, e.sub, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px', color: '#778899',
            });
        });
    }

    _drawControls(cx, y) {
        this.add.text(cx, y, 'CONTROLS', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '9px', color: '#aaaaaa',
        }).setOrigin(0.5);

        const lines = [
            ['ARROW KEYS / WASD', 'MOVE'],
            ['MOUSE',             'AIM'],
            ['LEFT CLICK (HOLD)', 'SHOOT'],
        ];
        lines.forEach(([k, v], i) => {
            const row = y + 22 + i * 20;
            this.add.text(cx - 140, row, k, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px', color: '#00cccc',
            });
            this.add.text(cx + 140, row, v, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px', color: '#ffffff',
            }).setOrigin(1, 0);
        });
    }

    _spawnGhosts() {
        const types = ['enemy_grunt', 'enemy_rusher', 'enemy_tank'];
        for (let i = 0; i < 8; i++) {
            const x   = Phaser.Math.Between(50, CONFIG.ARENA_WIDTH  - 50);
            const y   = Phaser.Math.Between(50, CONFIG.ARENA_HEIGHT - 50);
            const img = this.add.image(x, y, Phaser.Utils.Array.GetRandom(types));
            img.setAlpha(0.07).setDepth(1);
            img.setScale(Phaser.Math.FloatBetween(0.8, 2.0));

            const tx = Phaser.Math.Between(50, CONFIG.ARENA_WIDTH  - 50);
            const ty = Phaser.Math.Between(50, CONFIG.ARENA_HEIGHT - 50);
            this.tweens.add({
                targets:  img,
                x:        tx,
                y:        ty,
                duration: Phaser.Math.Between(6000, 14000),
                ease:     'Sine.InOut',
                yoyo:     true,
                repeat:   -1,
            });
        }
    }
}
