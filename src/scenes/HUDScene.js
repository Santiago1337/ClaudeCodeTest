class HUDScene extends Phaser.Scene {
    constructor() { super({ key: 'HUDScene' }); }

    create() {
        const W = CONFIG.ARENA_WIDTH;
        const PAD = 14;

        // ── Health bar ────────────────────────────────────────
        this.add.text(PAD, PAD, 'HP', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '9px', color: '#aaffaa',
        });

        this.hpBg = this.add.image(PAD + 26, PAD + 2, 'hpBg').setOrigin(0, 0);
        this.hpBar = this.add.image(PAD + 26, PAD + 2, 'hpFill').setOrigin(0, 0);

        // ── Score ─────────────────────────────────────────────
        this.scoreTxt = this.add.text(W - PAD, PAD, 'SCORE  0', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px', color: '#f9ca24',
        }).setOrigin(1, 0);

        // ── Level / Wave ──────────────────────────────────────
        this.levelTxt = this.add.text(W / 2, PAD, 'LEVEL 1', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px', color: '#00e5e5',
        }).setOrigin(0.5, 0);

        this.waveTxt = this.add.text(W / 2, PAD + 18, 'WAVE 1 / 3', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px', color: '#778899',
        }).setOrigin(0.5, 0);

        // ── Wave cleared notice ───────────────────────────────
        this.waveClearTxt = this.add.text(W / 2, CONFIG.ARENA_HEIGHT / 2 - 60, '', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '18px', color: '#f9ca24',
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setAlpha(0).setDepth(30);

        // ── Subscribe to game events ──────────────────────────
        window.GameEvents.on('healthUpdate', this._onHealth, this);
        window.GameEvents.on('scoreUpdate',  this._onScore,  this);
        window.GameEvents.on('waveStart',    this._onWave,   this);
        window.GameEvents.on('waveCleared',  this._onWaveCleared, this);

        this.events.once('shutdown', this._cleanup, this);
        this.events.once('destroy',  this._cleanup, this);
    }

    _onHealth(hp) {
        const pct = Math.max(0, hp / CONFIG.PLAYER_HP);
        this.hpBar.setScale(pct, 1);

        // Colour shifts red as HP drops
        if (pct > 0.5)       this.hpBar.setTint(0x27ae60);
        else if (pct > 0.25) this.hpBar.setTint(0xe67e22);
        else                 this.hpBar.setTint(0xe74c3c);
    }

    _onScore(score) {
        this.scoreTxt.setText('SCORE  ' + score.toLocaleString());
    }

    _onWave(data) {
        this.levelTxt.setText('LEVEL ' + data.level);
        this.waveTxt.setText('WAVE ' + data.wave + ' / ' + data.total);
    }

    _onWaveCleared(data) {
        if (data.last) return; // level-complete handled by transition scene
        this.waveClearTxt.setText('WAVE CLEARED!').setAlpha(1);
        this.tweens.add({
            targets:  this.waveClearTxt,
            alpha:    0,
            duration: 900,
            delay:    600,
        });
    }

    _cleanup() {
        if (window.GameEvents) {
            window.GameEvents.off('healthUpdate', this._onHealth, this);
            window.GameEvents.off('scoreUpdate',  this._onScore,  this);
            window.GameEvents.off('waveStart',    this._onWave,   this);
            window.GameEvents.off('waveCleared',  this._onWaveCleared, this);
        }
    }
}
