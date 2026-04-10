class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        const def = ENEMY_DEFS[type];
        super(scene, x, y, def.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.enemyType  = type;
        this.def        = def;
        this.hp         = def.hp;
        this.speed      = def.speed;
        this.damage     = def.damage;
        this.scoreValue = def.score;
        this.dead       = false;

        this.setDepth(5);
        // No world-bounds collision – they spawn from edges and naturally enter
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.dead || !this.active) return;

        const player = this.scene.player;
        if (!player || !player.alive) {
            this.setVelocity(0, 0);
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
        this.setRotation(angle);
    }

    // Returns true if enemy dies from this hit
    hit() {
        if (this.dead) return false;
        this.hp -= CONFIG.BULLET_DAMAGE;

        // Brief white tint
        this.setTint(0xffffff);
        this.scene.time.delayedCall(80, () => {
            if (this.scene && !this.dead) this.clearTint();
        });

        if (this.hp <= 0) {
            this.dead = true;
            return true;
        }
        return false;
    }
}
