const CONFIG = {
    ARENA_WIDTH: 800,
    ARENA_HEIGHT: 600,
    PLAYER_SPEED: 210,
    PLAYER_HP: 100,
    BULLET_SPEED: 560,
    BULLET_COOLDOWN: 220,
    BULLET_DAMAGE: 1,
    INVINCIBILITY_DURATION: 1400,
    SCREEN_SHAKE_DURATION: 140,
    SCREEN_SHAKE_INTENSITY: 0.003,
};

const ENEMY_DEFS = {
    GRUNT: {
        key: 'enemy_grunt',
        speed: 88,
        hp: 2,
        damage: 15,
        score: 100,
        color: 0xe74c3c,
        w: 24, h: 24,
    },
    RUSHER: {
        key: 'enemy_rusher',
        speed: 172,
        hp: 1,
        damage: 25,
        score: 150,
        color: 0x9b59b6,
        w: 26, h: 16,
    },
    TANK: {
        key: 'enemy_tank',
        speed: 52,
        hp: 6,
        damage: 35,
        score: 300,
        color: 0x7f8c8d,
        w: 40, h: 40,
    },
};

const LEVEL_DEFS = [
    {   // Level 1 – Grunt only
        bonus: 500,
        waves: [
            [{ type: 'GRUNT', count: 5 }],
            [{ type: 'GRUNT', count: 9 }],
            [{ type: 'GRUNT', count: 13 }],
        ]
    },
    {   // Level 2 – Grunts + Rushers
        bonus: 1000,
        waves: [
            [{ type: 'GRUNT', count: 6 }, { type: 'RUSHER', count: 3 }],
            [{ type: 'GRUNT', count: 7 }, { type: 'RUSHER', count: 5 }],
            [{ type: 'RUSHER', count: 12 }],
        ]
    },
    {   // Level 3 – All types
        bonus: 1500,
        waves: [
            [{ type: 'GRUNT', count: 8 }, { type: 'RUSHER', count: 4 }],
            [{ type: 'RUSHER', count: 7 }, { type: 'TANK', count: 2 }],
            [{ type: 'GRUNT', count: 10 }, { type: 'TANK', count: 3 }],
            [{ type: 'RUSHER', count: 8 }, { type: 'TANK', count: 3 }],
        ]
    },
    {   // Level 4 – Heavier mix
        bonus: 2000,
        waves: [
            [{ type: 'GRUNT', count: 10 }, { type: 'RUSHER', count: 6 }, { type: 'TANK', count: 2 }],
            [{ type: 'GRUNT', count: 8 },  { type: 'RUSHER', count: 8 }, { type: 'TANK', count: 3 }],
            [{ type: 'RUSHER', count: 14 }, { type: 'TANK', count: 4 }],
            [{ type: 'GRUNT', count: 16 }, { type: 'TANK', count: 3 }],
        ]
    },
    {   // Level 5 – Boss rush
        bonus: 3000,
        waves: [
            [{ type: 'GRUNT', count: 12 }, { type: 'RUSHER', count: 8 }, { type: 'TANK', count: 3 }],
            [{ type: 'RUSHER', count: 16 }, { type: 'TANK', count: 4 }],
            [{ type: 'GRUNT', count: 20 }, { type: 'RUSHER', count: 6 }, { type: 'TANK', count: 5 }],
            [{ type: 'RUSHER', count: 20 }, { type: 'TANK', count: 6 }],
            [{ type: 'GRUNT', count: 10 }, { type: 'RUSHER', count: 10 }, { type: 'TANK', count: 8 }],
        ]
    },
];

// Global cross-scene event bus (initialised in BootScene)
window.GameEvents = null;
