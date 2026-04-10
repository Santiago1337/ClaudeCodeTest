class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp        = CONFIG.PLAYER_HP;
        this.maxHp     = CONFIG.PLAYER_HP;
        this.isInvincible = false;
        this.lastShot  = 0;
        this.alive     = true;

        this.setCollideWorldBounds(true);
        this.setDepth(10);

        this.cursors = scene.input.keyboard.createCursorKeys();
        // WASD support
        this.wasd = scene.input.keyboard.addKeys({
            up:    Phaser.Input.Keyboard.KeyCodes.W,
            down:  Phaser.Input.Keyboard.KeyCodes.S,
            left:  Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
    }

    update(time, delta) {
        if (!this.alive) return;

        // Movement
        const cur  = this.cursors;
        const wasd = this.wasd;
        let vx = 0, vy = 0;

        if (cur.left.isDown  || wasd.left.isDown)  vx -= 1;
        if (cur.right.isDown || wasd.right.isDown) vx += 1;
        if (cur.up.isDown    || wasd.up.isDown)    vy -= 1;
        if (cur.down.isDown  || wasd.down.isDown)  vy += 1;

        if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071; }
        this.setVelocity(vx * CONFIG.PLAYER_SPEED, vy * CONFIG.PLAYER_SPEED);

        // Aim toward mouse
        const ptr = this.scene.input.activePointer;
        this.setRotation(Phaser.Math.Angle.Between(this.x, this.y, ptr.x, ptr.y));
    }

    tryShoot(time, bulletGroup) {
        if (!this.alive) return;
        if (time - this.lastShot < CONFIG.BULLET_COOLDOWN) return;
        this.lastShot = time;

        const ptr   = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, ptr.x, ptr.y);
        const bx    = this.x + Math.cos(angle) * 20;
        const by    = this.y + Math.sin(angle) * 20;

        // Add to group first (group.add resets the body), then launch
        const bullet = new Bullet(this.scene, bx, by);
        bulletGroup.add(bullet);
        bullet.launch(angle);

        ParticleEffects.spawnMuzzleFlash(this.scene, bx, by);
    }

    takeDamage(amount) {
        if (this.isInvincible || !this.alive) return false;

        this.hp = Math.max(0, this.hp - amount);
        this.isInvincible = true;

        // Flash + blink
        this.scene.tweens.add({
            targets:  this,
            alpha:    0.1,
            duration: 90,
            yoyo:     true,
            repeat:   5,
            onComplete: () => {
                if (this.scene) {
                    this.setAlpha(1);
                    this.isInvincible = false;
                }
            }
        });

        return true;
    }

    die() {
        this.alive = false;
        this.setVelocity(0, 0);
        this.scene.tweens.add({
            targets:  this,
            alpha:    0,
            scaleX:   2,
            scaleY:   2,
            duration: 600,
            ease:     'Power2',
        });
    }
}
