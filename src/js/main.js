/**
 * main.js
 * Application entry point and event wiring
 */

let gameEngine = null;
let audioEngine = null;
let leaderboard = null;
let ui = null;

/**
 * Initialize the entire application
 */
async function initializeApp() {
    // Create instances
    gameEngine = new GameEngine();
    audioEngine = new AudioEngine();
    leaderboard = new LeaderboardManager();
    ui = new UIManager();

    // Initialize UI
    ui.init();

    // Initialize canvas
    const canvas = document.getElementById('gameCanvas');
    gameEngine.initCanvas(canvas);
    gameEngine.audioEngine = audioEngine;

    // Initialize audio (async)
    await audioEngine.init();

    // Set up input handlers
    setupInputHandlers();

    // Set up UI event handlers
    setupUIHandlers();

    // Set up game event listeners
    setupGameEventListeners();

    // Load initial leaderboard
    await leaderboard.fetchScores(5);
}

/**
 * Set up keyboard and touch input handlers
 */
function setupInputHandlers() {
    // Keyboard input
    document.addEventListener('keydown', (e) => {
        const lane = Object.keys(KEY_MAP).indexOf(e.code);
        if (lane !== -1) {
            gameEngine.handleInput(lane);
        }
    });

    // Touch input
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('touchstart', (e) => {
        if (!gameEngine.gameState.isPlaying) return;
        e.preventDefault();

        const canvasRect = canvas.getBoundingClientRect();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const x = e.changedTouches[i].clientX - canvasRect.left;
            const lane = Math.floor(x / (canvasRect.width / 4));
            if (lane >= 0 && lane < 4) gameEngine.handleInput(lane);
        }
    }, { passive: false });

    // Mouse input
    canvas.addEventListener('mousedown', (e) => {
        if (!gameEngine.gameState.isPlaying) return;
        const canvasRect = canvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const lane = Math.floor(x / (canvasRect.width / 4));
        if (lane >= 0 && lane < 4) gameEngine.handleInput(lane);
    });
}

/**
 * Set up UI button and event handlers
 */
function setupUIHandlers() {
    // Start game
    ui.elements.startBtn.addEventListener('click', () => {
        const selectedSong = ui.elements.songSelect.value;
        ui.showScreen('gameOverScreen');
        ui.elements.gameOverScreen.style.display = 'none';
        gameEngine.startGame(selectedSong);
    });

    // Restart game
    ui.elements.restartBtn.addEventListener('click', () => {
        audioEngine.playUISound();
        ui.showScreen('startScreen');
    });

    // View leaderboard
    ui.elements.viewLeaderboardBtn.addEventListener('click', async () => {
        ui.showScreen('gameOverScreen');
        ui.elements.submitScreen.style.display = 'none';
        ui.elements.leaderboardScreen.style.display = 'block';
        await leaderboard.fetchScores(5);
    });

    // Submit score
    ui.elements.submitScoreBtn.addEventListener('click', submitScore);

    // Skip submit
    ui.elements.submitSkipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ui.elements.submitScreen.style.display = 'none';
        ui.elements.leaderboardScreen.style.display = 'block';
        leaderboard.fetchScores(5);
    });
}

/**
 * Submit player score to leaderboard
 */
async function submitScore() {
    const name = ui.elements.playerNameInput.value.trim() || 'Stray Cat';
    const score = gameEngine.gameState.score || 0;

    if (ui.elements.submitScoreBtn.disabled) return;

    // Validate eligibility
    if (!leaderboard.isEligible(score)) {
        ui.elements.submitMsg.innerText = "Not in Top 5 — cannot submit.";
        ui.elements.submitMsg.classList.remove('hidden');
        return;
    }

    ui.elements.submitScoreBtn.disabled = true;
    ui.elements.submitScoreBtn.innerText = "Saving...";

    try {
        await leaderboard.submitScore(name, score);
        ui.elements.submitMsg.innerText = "Score Saved!";
        ui.elements.submitMsg.classList.remove('hidden');
        ui.elements.playerNameInput.disabled = true;

        // Show leaderboard after successful submit
        setTimeout(() => {
            ui.elements.submitScreen.style.display = 'none';
            ui.elements.leaderboardScreen.style.display = 'block';
        }, 500);
    } catch (error) {
        ui.elements.submitMsg.innerText = "Error Saving!";
        ui.elements.submitMsg.classList.remove('hidden');
        ui.elements.submitScoreBtn.disabled = false;
        ui.elements.submitScoreBtn.innerText = "Try Again";
    }
}

/**
 * Set up custom game event listeners
 */
function setupGameEventListeners() {
    // When game ends
    window.addEventListener('gameEnd', async (e) => {
        const gameState = e.detail;

        ui.showGameOver(gameState);

        // Fetch leaderboard to check eligibility
        await leaderboard.fetchScores(5);
        const isEligible = leaderboard.isEligible(gameState.score);

        ui.showPostGameScreen(isEligible, leaderboard);
    });

    // When score updates
    window.addEventListener('scoreUpdate', (e) => {
        ui.updateScoreboard(e.detail);
    });

    // When lyrics update
    window.addEventListener('lyricUpdate', (e) => {
        ui.updateLyrics(e.detail);
    });
}

/**
 * Resume audio context on user interaction
 */
function setupAudioResume() {
    document.addEventListener('click', () => {
        audioEngine.resume();
    }, { once: true });

    document.addEventListener('touchstart', () => {
        audioEngine.resume();
    }, { once: true });
}

/**
 * Main entry point
 */
window.addEventListener('load', async () => {
    await initializeApp();
    setupAudioResume();
});
