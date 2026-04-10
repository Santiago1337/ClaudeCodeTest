class ParticleEffects {

    static spawnHitParticles(scene, x, y, enemyType) {
        const color = ENEMY_DEFS[enemyType] ? ENEMY_DEFS[enemyType].color : 0xff0000;
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist  = 20 + Math.random() * 30;
            const size  = 2 + Math.random() * 2;
            const circ  = scene.add.circle(x, y, size, color);
            circ.setDepth(20);
            scene.tweens.add({
                targets: circ,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 200 + Math.random() * 150,
                ease: 'Power2',
                onComplete: () => { if (circ.scene) circ.destroy(); }
            });
        }
    }

    static spawnDeathExplosion(scene, x, y, enemyType) {
        const color = ENEMY_DEFS[enemyType] ? ENEMY_DEFS[enemyType].color : 0xff0000;
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.3;
            const dist  = 40 + Math.random() * 50;
            const size  = 3 + Math.random() * 5;
            const circ  = scene.add.circle(x, y, size, color);
            circ.setDepth(20);
            scene.tweens.add({
                targets: circ,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scaleX: 0.1,
                scaleY: 0.1,
                duration: 400 + Math.random() * 300,
                ease: 'Power3',
                onComplete: () => { if (circ.scene) circ.destroy(); }
            });
        }
        const ring = scene.add.circle(x, y, 4, color);
        ring.setAlpha(0.8).setDepth(18);
        scene.tweens.add({
            targets: ring,
            scaleX: 6, scaleY: 6, alpha: 0,
            duration: 350, ease: 'Sine.Out',
            onComplete: () => { if (ring.scene) ring.destroy(); }
        });
    }

    static spawnMuzzleFlash(scene, x, y) {
        const flash = scene.add.circle(x, y, 7, 0xfff59d);
        flash.setDepth(22);
        scene.tweens.add({
            targets: flash,
            scaleX: 2.5, scaleY: 2.5, alpha: 0,
            duration: 70,
            onComplete: () => { if (flash.scene) flash.destroy(); }
        });
    }

    static spawnScreenFlash(scene) {
        const rect = scene.add.rectangle(
            CONFIG.ARENA_WIDTH / 2, CONFIG.ARENA_HEIGHT / 2,
            CONFIG.ARENA_WIDTH, CONFIG.ARENA_HEIGHT,
            0xff3333, 0.3
        );
        rect.setDepth(50);
        scene.tweens.add({
            targets: rect, alpha: 0, duration: 300,
            onComplete: () => { if (rect.scene) rect.destroy(); }
        });
    }
}
