class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }

    init(data) {
        this.currentLevel  = data && data.level !== undefined ? data.level : 0;
        this.score         = data && data.score  !== undefined ? data.score  : 0;
        this.enemiesKilled = data && data.enemiesKilled ? data.enemiesKilled : 0;
        this.currentWave   = 0;
        this.waveActive    = false;
        this.spawnQueue    = [];
        this.gameEnded     = false;
    }

    create() {
        // Background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(0);

        // World bounds
        this.physics.world.setBounds(0, 0, CONFIG.ARENA_WIDTH, CONFIG.ARENA_HEIGHT);

        // Bullet group (bullets are created/destroyed dynamically)
        this.bulletGroup = this.physics.add.group();

        // Player
        this.player = new Player(
            this,
            CONFIG.ARENA_WIDTH  / 2,
            CONFIG.ARENA_HEIGHT / 2
        );

        // Enemy group
        this.enemyGroup = this.physics.add.group();

        // ── Collisions ───────────────────────────────────────
        this.physics.add.overlap(
            this.bulletGroup, this.enemyGroup,
            this._onBulletHitEnemy, null, this
        );
        this.physics.add.overlap(
            this.player, this.enemyGroup,
            this._onEnemyHitPlayer, null, this
        );

        // ── Input ────────────────────────────────────────────
        this.input.on('pointerdown', (ptr) => {
            if (ptr.leftButtonDown()) this.player.tryShoot(this.time.now, this.bulletGroup);
        });

        // ── ESC to pause ─────────────────────────────────────
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.gameEnded) return;
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        // ── Launch HUD overlay ───────────────────────────────
        this.scene.launch('HUDScene');

        // Small fade-in, then start wave
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.time.delayedCall(500, () => this._startWave());

        // Broadcast initial state
        this._emitHud();
    }

    update(time, delta) {
        if (this.gameEnded) return;

        this.player.update(time, delta);

        // Hold-to-shoot
        if (this.input.activePointer.isDown && this.input.activePointer.leftButtonDown()) {
            this.player.tryShoot(time, this.bulletGroup);
        }

        // Check wave completion
        if (
            this.waveActive &&
            this.spawnQueue.length === 0 &&
            this.enemyGroup.countActive(true) === 0
        ) {
            this.waveActive = false;
            this._onWaveComplete();
        }

        // Player death
        if (this.player.alive && this.player.hp <= 0) {
            this.player.alive = false;
            this.player.die();
            this.gameEnded = true;
            this.time.delayedCall(1200, () => {
                this.scene.stop('HUDScene');
                this.scene.start('GameOverScene', {
                    score:         this.score,
                    victory:       false,
                    enemiesKilled: this.enemiesKilled,
                });
            });
        }
    }

    // ── Wave management ──────────────────────────────────────

    _startWave() {
        if (this.gameEnded) return;
        const levelDef = LEVEL_DEFS[this.currentLevel];
        const waveDef  = levelDef.waves[this.currentWave];

        // Build shuffled spawn queue
        this.spawnQueue = [];
        waveDef.forEach(entry => {
            for (let i = 0; i < entry.count; i++) {
                this.spawnQueue.push(entry.type);
            }
        });
        Phaser.Utils.Array.Shuffle(this.spawnQueue);

        this.waveActive = true;

        window.GameEvents.emit('waveStart', {
            wave:  this.currentWave + 1,
            total: levelDef.waves.length,
            level: this.currentLevel + 1,
        });

        // Trickle in enemies
        this._spawnTimer = this.time.addEvent({
            delay:         500,
            callback:      this._spawnNext,
            callbackScope: this,
            repeat:        this.spawnQueue.length - 1,
        });
    }

    _spawnNext() {
        if (this.spawnQueue.length === 0) return;
        const type = this.spawnQueue.shift();
        const pos  = this._edgePos();
        const e    = new Enemy(this, pos.x, pos.y, type);
        this.enemyGroup.add(e, false);
    }

    _edgePos() {
        const W = CONFIG.ARENA_WIDTH, H = CONFIG.ARENA_HEIGHT;
        switch (Phaser.Math.Between(0, 3)) {
            case 0: return { x: Phaser.Math.Between(0, W), y: -30 };
            case 1: return { x: W + 30, y: Phaser.Math.Between(0, H) };
            case 2: return { x: Phaser.Math.Between(0, W), y: H + 30 };
            default: return { x: -30, y: Phaser.Math.Between(0, H) };
        }
    }

    _onWaveComplete() {
        const levelDef = LEVEL_DEFS[this.currentLevel];
        this.currentWave++;
        const isLastWave = this.currentWave >= levelDef.waves.length;

        window.GameEvents.emit('waveCleared', { last: isLastWave });

        if (isLastWave) {
            // Level complete
            this.score += levelDef.bonus;
            window.GameEvents.emit('scoreUpdate', this.score);

            this.gameEnded = true;
            this.time.delayedCall(800, () => {
                this.scene.stop('HUDScene');

                if (this.currentLevel >= LEVEL_DEFS.length - 1) {
                    // All levels done → Victory
                    this.scene.start('GameOverScene', {
                        score:         this.score,
                        victory:       true,
                        enemiesKilled: this.enemiesKilled,
                    });
                } else {
                    this.scene.start('LevelTransitionScene', {
                        level: this.currentLevel,
                        score: this.score,
                        enemiesKilled: this.enemiesKilled,
                    });
                }
            });
        } else {
            // Next wave in 1.8 s
            this.time.delayedCall(1800, () => this._startWave());
        }
    }

    // ── Collision handlers ───────────────────────────────────

    _onBulletHitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active || enemy.dead) return;

        bullet.destroy();

        ParticleEffects.spawnHitParticles(this, enemy.x, enemy.y, enemy.enemyType);

        const died = enemy.hit();
        if (died) {
            this.score += enemy.scoreValue;
            this.enemiesKilled++;
            window.GameEvents.emit('scoreUpdate', this.score);
            ParticleEffects.spawnDeathExplosion(this, enemy.x, enemy.y, enemy.enemyType);
            enemy.destroy();
        }
    }

    _onEnemyHitPlayer(player, enemy) {
        if (!player.alive || !enemy.active || enemy.dead) return;

        const damaged = player.takeDamage(enemy.damage);
        if (damaged) {
            window.GameEvents.emit('healthUpdate', player.hp);
            ParticleEffects.spawnScreenFlash(this);
            this.cameras.main.shake(
                CONFIG.SCREEN_SHAKE_DURATION,
                CONFIG.SCREEN_SHAKE_INTENSITY
            );
        }
    }

    _emitHud() {
        window.GameEvents.emit('healthUpdate', this.player.hp);
        window.GameEvents.emit('scoreUpdate',  this.score);
        window.GameEvents.emit('waveStart', {
            wave:  1,
            total: LEVEL_DEFS[this.currentLevel].waves.length,
            level: this.currentLevel + 1,
        });
    }
}
