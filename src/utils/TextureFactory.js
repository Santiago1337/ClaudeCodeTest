class TextureFactory {
    static createAll(scene) {
        TextureFactory.createPlayer(scene);
        TextureFactory.createGrunt(scene);
        TextureFactory.createRusher(scene);
        TextureFactory.createTank(scene);
        TextureFactory.createBullet(scene);
        TextureFactory.createBackground(scene);
        TextureFactory.createHealthBarBg(scene);
        TextureFactory.createHealthBarFill(scene);
    }

    // Player: 36×36, gun barrel points RIGHT (east = Phaser 0°)
    static createPlayer(scene) {
        const g = scene.add.graphics();
        const W = 36, H = 36, cx = 18, cy = 18;

        // Tread shadows (bottom layer)
        g.fillStyle(0x006060, 1);
        g.fillRect(4,  cy - 14, 6, 28);
        g.fillRect(W - 10, cy - 14, 6, 28);

        // Treads (highlight bands)
        g.fillStyle(0x008888, 1);
        for (let i = -12; i <= 12; i += 6) {
            g.fillRect(4,      cy + i, 6, 3);
            g.fillRect(W - 10, cy + i, 6, 3);
        }

        // Hull body
        g.fillStyle(0x00b5b5, 1);
        g.fillRect(10, cy - 11, 20, 22);

        // Hull highlight
        g.fillStyle(0x00e0e0, 1);
        g.fillRect(12, cy - 9, 10, 12);

        // Turret base
        g.fillStyle(0x009090, 1);
        g.fillCircle(cx, cy, 9);

        // Turret highlight
        g.fillStyle(0x00cccc, 1);
        g.fillCircle(cx - 1, cy - 1, 5);

        // Gun barrel (pointing right)
        g.fillStyle(0x003e3e, 1);
        g.fillRect(cx, cy - 3, 17, 6);

        // Barrel tip
        g.fillStyle(0x005050, 1);
        g.fillRect(cx + 14, cy - 2, 5, 4);

        g.generateTexture('player', W, H);
        g.destroy();
    }

    // Grunt: 24×24 – red angular mech
    static createGrunt(scene) {
        const g = scene.add.graphics();
        const W = 24, H = 24, cx = 12, cy = 12;

        // Outer shell
        g.fillStyle(0x922b21, 1);
        g.fillRect(2, 2, 20, 20);

        // Corner cuts (make it angular)
        g.fillStyle(0x000000, 0);
        g.fillStyle(0x1a1a2e, 1);
        g.fillTriangle(2, 2, 6, 2, 2, 6);
        g.fillTriangle(22, 2, 18, 2, 22, 6);
        g.fillTriangle(2, 22, 6, 22, 2, 18);
        g.fillTriangle(22, 22, 18, 22, 22, 18);

        // Front plate
        g.fillStyle(0xe74c3c, 1);
        g.fillRect(5, 5, 14, 14);

        // Centre eye
        g.fillStyle(0xff6b6b, 1);
        g.fillCircle(cx, cy, 4);
        g.fillStyle(0xff0000, 1);
        g.fillCircle(cx, cy, 2);
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx + 1, cy - 1, 1);

        g.generateTexture('enemy_grunt', W, H);
        g.destroy();
    }

    // Rusher: 26×16 – purple diamond pointing RIGHT
    static createRusher(scene) {
        const g = scene.add.graphics();
        const W = 26, H = 16, cx = 13, cy = 8;

        // Outer diamond
        g.fillStyle(0x6c3483, 1);
        g.fillPoints([
            { x: 0,  y: cy },
            { x: cx, y: 0  },
            { x: W,  y: cy },
            { x: cx, y: H  },
        ], true);

        // Inner highlight
        g.fillStyle(0x9b59b6, 1);
        g.fillPoints([
            { x: 4,      y: cy     },
            { x: cx,     y: 3      },
            { x: W - 4,  y: cy     },
            { x: cx,     y: H - 3  },
        ], true);

        // Bright centre
        g.fillStyle(0xd7bde2, 1);
        g.fillCircle(cx, cy, 2);

        // Speed lines
        g.fillStyle(0x4a235a, 1);
        g.fillRect(1, cy - 1, 5, 2);

        g.generateTexture('enemy_rusher', W, H);
        g.destroy();
    }

    // Tank: 40×40 – grey hexagon
    static createTank(scene) {
        const g = scene.add.graphics();
        const W = 40, H = 40, cx = 20, cy = 20;

        // Build hexagon points
        const outerR = 18, innerR = 12;
        const outer = [], inner = [];
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            outer.push({ x: cx + outerR * Math.cos(a), y: cy + outerR * Math.sin(a) });
            inner.push({ x: cx + innerR * Math.cos(a), y: cy + innerR * Math.sin(a) });
        }

        // Drop shadow
        g.fillStyle(0x2c3e50, 1);
        g.fillPoints(outer.map(p => ({ x: p.x + 2, y: p.y + 2 })), true);

        // Main body
        g.fillStyle(0x566573, 1);
        g.fillPoints(outer, true);

        // Inner plate
        g.fillStyle(0x7f8c8d, 1);
        g.fillPoints(inner, true);

        // Armour lines
        g.lineStyle(1, 0x4a5568, 1);
        for (let i = 0; i < 6; i++) {
            g.lineBetween(outer[i].x, outer[i].y, inner[i].x, inner[i].y);
        }

        // Core
        g.fillStyle(0x99a3a4, 1);
        g.fillCircle(cx, cy, 6);
        g.fillStyle(0xbfc9ca, 1);
        g.fillCircle(cx - 1, cy - 1, 3);
        g.fillStyle(0x2c3e50, 1);
        g.fillCircle(cx, cy, 2);

        g.generateTexture('enemy_tank', W, H);
        g.destroy();
    }

    // Bullet: 12×6 – yellow capsule pointing RIGHT
    static createBullet(scene) {
        const g = scene.add.graphics();

        g.fillStyle(0xf4d03f, 1);
        g.fillEllipse(6, 3, 12, 6);
        g.fillStyle(0xfff9c4, 1);
        g.fillEllipse(5, 2, 6, 3);

        g.generateTexture('bullet', 12, 6);
        g.destroy();
    }

    // Arena background with grid
    static createBackground(scene) {
        const g = scene.add.graphics();
        const W = CONFIG.ARENA_WIDTH, H = CONFIG.ARENA_HEIGHT;

        // Base fill
        g.fillStyle(0x12122a, 1);
        g.fillRect(0, 0, W, H);

        // Grid (minor)
        g.lineStyle(1, 0x1a1a40, 1);
        for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H);
        for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y);

        // Grid (major)
        g.lineStyle(1, 0x22224e, 1);
        for (let x = 0; x <= W; x += 160) g.lineBetween(x, 0, x, H);
        for (let y = 0; y <= H; y += 120) g.lineBetween(0, y, W, y);

        // Soft vignette edges
        g.fillStyle(0x000010, 0.45);
        g.fillRect(0, 0, W, 60);
        g.fillRect(0, H - 60, W, 60);
        g.fillRect(0, 0, 60, H);
        g.fillRect(W - 60, 0, 60, H);

        g.generateTexture('background', W, H);
        g.destroy();
    }

    static createHealthBarBg(scene) {
        const g = scene.add.graphics();
        g.fillStyle(0x333333, 1);
        g.fillRect(0, 0, 200, 16);
        g.lineStyle(2, 0x555555, 1);
        g.strokeRect(0, 0, 200, 16);
        g.generateTexture('hpBg', 200, 16);
        g.destroy();
    }

    static createHealthBarFill(scene) {
        const g = scene.add.graphics();
        g.fillStyle(0x27ae60, 1);
        g.fillRect(0, 0, 200, 16);
        g.generateTexture('hpFill', 200, 16);
        g.destroy();
    }
}
