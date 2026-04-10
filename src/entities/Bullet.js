class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(8);
        this.lifespan = 0;
    }

    // Called AFTER being added to the bullet group
    launch(angle) {
        this.setRotation(angle);
        this.lifespan = 1600;
        this.setVelocity(
            Math.cos(angle) * CONFIG.BULLET_SPEED,
            Math.sin(angle) * CONFIG.BULLET_SPEED
        );
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (!this.active) return;
        this.lifespan -= delta;
        if (
            this.lifespan <= 0 ||
            this.x < -40 || this.x > CONFIG.ARENA_WIDTH  + 40 ||
            this.y < -40 || this.y > CONFIG.ARENA_HEIGHT + 40
        ) {
            this.destroy();
        }
    }
}
