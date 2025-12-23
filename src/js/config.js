/**
 * config.js
 * Game constants, API configuration, and audio settings.
 */

// --- API CONFIGURATION ---
// Use local proxy in development (localhost), real API in production
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const CONFIG = {
    API: {
        BASE_URL: isDev ? 'http://localhost:3000/api/v1' : 'https://lb.yogurtthehor.se/api/v1',
        LEADERBOARD_ID: '106',
        LEADERBOARD_SECRET: 'ed26e5e211b8442fa21c05df772c37cf'
    },
    
    AUDIO: {
        MEOW_URL: 'https://joinusinchance.github.io/game/mixkit-sweet-kitty-meow-93.wav',
        FX_URL: 'https://joinusinchance.github.io/game/mixkit-little-cat-pain-meow-87.wav',
        PAW_IMAGE_URL: 'https://joinusinchance.github.io/game/paw.png',
        BASE_FREQUENCY: 261.63,
        OCTAVE_OFFSET: 0.65,
        MASTER_GAIN: 0.6
    },
    
    GAME: {
        LANE_COUNT: 4,
        BASE_SPEED: 500,
        HIT_WINDOW: 0.35,
        LANE_COLORS: ['#EC4899', '#3B82F6', '#FCD34D', '#A78BFA'],
        LANE_ITEMS: ['🎧', '🐱', '🎵', '🎹']
    },
    
    SCORING: {
        PERFECT_THRESHOLD: 0.1,
        GOOD_THRESHOLD: 0.25,
        PERFECT_SCORE: 100,
        GOOD_SCORE: 50,
        MEH_SCORE: 10
    },
    
    RANKS: [
        { threshold: 0.999, name: "Pop Star Purrfection!" },
        { threshold: 0.9, name: "Nine-Life Legend" },
        { threshold: 0.8, name: "The Gilded Aristocat" },
        { threshold: 0.7, name: "Grand Claw-mander" },
        { threshold: 0.6, name: "Premier Purr-former" },
        { threshold: 0.5, name: "Silver-Whiskered Specialist" },
        { threshold: 0.4, name: "Sofa-Sultan" },
        { threshold: 0.3, name: "Barnyard Mouser" },
        { threshold: 0.2, name: "Flea-Bitten Stray" },
        { threshold: 0.1, name: "Sewer-Sodden Scruff" },
        { threshold: 0, name: "Drowned Alley-Scamp" }
    ]
};

/**
 * NOTE_FREQS: Comprehensive note-to-frequency mapping
 * Includes sharps, flats, and enharmonic equivalents across octaves 2-6
 */
const NOTE_FREQS = {
    'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
    'C6': 1046.50,
    'B#1': 65.41, 'B#2': 130.81, 'B#3': 261.63, 'B#4': 523.25, 'B#5': 1046.50,
    /* Enharmonic mappings */
    'Cb2': 61.735, 'Cb3': 123.47, 'Cb4': 246.94, 'Cb5': 493.88, 'Cb6': 987.77,
    'E#2': 87.31, 'E#3': 174.61, 'E#4': 349.23, 'E#5': 698.46,
    'Fb2': 82.41, 'Fb3': 164.81, 'Fb4': 329.63, 'Fb5': 659.25
};

/**
 * KEY_MAP: Maps keyboard keys to lane indices
 */
const KEY_MAP = {
    'KeyD': 0,
    'KeyF': 1,
    'KeyJ': 2,
    'KeyK': 3
};

/**
 * SCORING MESSAGES
 */
const SCORE_MESSAGES = {
    PERFECT: { text: "PURRFECT!", color: "#FF00FF", delta: 100 },
    GOOD: { text: "Grrreat!", color: "#33FFFF", delta: 50 },
    MEH: { text: "Mew", color: "#FFFF00", delta: 10 }
};
