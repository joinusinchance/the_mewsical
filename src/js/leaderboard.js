/**
 * leaderboard.js
 * Leaderboard API client and score management
 */

class LeaderboardManager {
    constructor() {
        this.lastScores = [];
    }

    /**
     * Fetch high scores from the leaderboard API
     * @param {number} limit - Number of scores to fetch (default 5)
     * @param {Object} highlight - Highlight object with score and name properties
     * @returns {Promise<Array>} Sorted score array
     */
    async fetchScores(limit = 5, highlight = null) {
        try {
            const url = `${CONFIG.API.BASE_URL}/scores/${CONFIG.API.LEADERBOARD_ID}/${limit}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch scores: ${response.status}`);
            }

            const data = await response.json();

            if (data && Array.isArray(data.scores)) {
                // Sort descending (highest score first)
                this.lastScores = data.scores.sort((a, b) => b.value - a.value).slice(0, limit);

                // Dispatch event with highlight info
                window.dispatchEvent(new CustomEvent('leaderboardLoaded', {
                    detail: {
                        scores: this.lastScores,
                        highlight: highlight
                    }
                }));

                return this.lastScores;
            } else {
                this.lastScores = [];
                return [];
            }
        } catch (error) {
            console.error('Leaderboard fetch error:', error);
            window.dispatchEvent(new CustomEvent('leaderboardError', {
                detail: { error: error.message }
            }));

            // Fallback: try to load cached scores from localStorage so UI still shows something
            try {
                const cached = localStorage.getItem('cachedLeaderboardScores');
                this.lastScores = cached ? JSON.parse(cached) : [];
            } catch (e) {
                this.lastScores = [];
            }

            // Still notify UI that leaderboard data is available (from cache/offline)
            window.dispatchEvent(new CustomEvent('leaderboardLoaded', {
                detail: { scores: this.lastScores, highlight: highlight }
            }));

            return this.lastScores || [];
        }
    }

    /**
     * Submit a score to the leaderboard
     * @param {string} name - Player name
     * @param {number} score - Score value
     * @returns {Promise<Object>} Response data
     */
    async submitScore(name, score) {
        try {
            // Client-side eligibility check
            const limit = 5;
            const scores = this.lastScores || [];
            const lowestScore = scores.length < limit ? 0 : (scores[scores.length - 1]?.value || 0);
            const isEligible = (scores.length < limit) || (score >= lowestScore);

            if (!isEligible) {
                const error = new Error('Score not in top 5');
                error.code = 'NOT_ELIGIBLE';
                throw error;
            }

            const url = `${CONFIG.API.BASE_URL}/scores/${CONFIG.API.LEADERBOARD_ID}/${CONFIG.API.LEADERBOARD_SECRET}/add/${encodeURIComponent(name)}/${score}/0`;
            const response = await fetch(url, { method: 'POST' });

            if (!response.ok) {
                throw new Error(`Failed to submit score: ${response.status}`);
            }

            // Fetch updated leaderboard with highlight
            await this.fetchScores(limit, { score, name });

            // Cache latest scores locally
            try { localStorage.setItem('cachedLeaderboardScores', JSON.stringify(this.lastScores)); } catch (e) {}

            window.dispatchEvent(new CustomEvent('scoreSubmitted', {
                detail: { name, score, success: true }
            }));

            return { success: true };
        } catch (error) {
            console.error('Score submission error:', error);
            window.dispatchEvent(new CustomEvent('scoreSubmitted', {
                detail: { name, score, success: false, error: error.message }
            }));
            // If submission failed due to network/API, save locally so user still sees their score
            if (error.message && (error.message.includes('Failed to submit') || error.message.includes('NetworkError') || error.message.includes('fetch'))) {
                try {
                    const cached = localStorage.getItem('cachedLeaderboardScores');
                    const arr = cached ? JSON.parse(cached) : [];
                    arr.push({ name: name, value: score });
                    arr.sort((a,b)=>b.value-a.value);
                    const limited = arr.slice(0, 5);
                    this.lastScores = limited;
                    localStorage.setItem('cachedLeaderboardScores', JSON.stringify(limited));
                    window.dispatchEvent(new CustomEvent('leaderboardLoaded', { detail: { scores: this.lastScores, highlight: {score, name} } }));
                    window.dispatchEvent(new CustomEvent('scoreSubmitted', { detail: { name, score, success: true, offline: true } }));
                    return { success: true, offline: true };
                } catch (e) {
                    // fall through to rethrow below
                }
            }
            throw error;
        }
    }

    /**
     * Check if a score is eligible for the top 5
     * @param {number} score - Score value
     * @returns {boolean} True if eligible
     */
    isEligible(score) {
        const limit = 5;
        const scores = this.lastScores || [];
        const lowestScore = scores.length < limit ? 0 : (scores[scores.length - 1]?.value || 0);
        return (scores.length < limit) || (score >= lowestScore);
    }

    /**
     * Get rank for a given score
     * @param {number} score - Score value
     * @returns {number} Rank (1-indexed), or -1 if not eligible
     */
    getRank(score) {
        for (let i = 0; i < this.lastScores.length; i++) {
            if (score > this.lastScores[i].value) {
                return i + 1;
            }
        }
        return this.lastScores.length < 5 ? this.lastScores.length + 1 : -1;
    }
}

/**
 * ui.js
 * UI manager for game screens and interactions
 */

class UIManager {
    constructor() {
        this.elements = {};
        this.currentScreen = null;
    }

    /**
     * Initialize all UI elements
     */
    init() {
        this.elements = {
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            viewLeaderboardBtn: document.getElementById('view-leaderboard-btn'),
            scoreBoard: document.getElementById('score-board'),
            comboBoard: document.getElementById('combo-board'),
            finalScore: document.getElementById('final-score'),
            maxCombo: document.getElementById('max-combo'),
            rankText: document.getElementById('rank-text'),
            songSelect: document.getElementById('song-select'),
            lyricsContainer: document.getElementById('lyrics-container'),
            submitScreen: document.getElementById('submit-screen'),
            leaderboardScreen: document.getElementById('leaderboard-screen'),
            playerNameInput: document.getElementById('player-name'),
            submitScoreBtn: document.getElementById('submit-score-btn'),
            submitSkipBtn: document.getElementById('submit-skip-btn'),
            submitMsg: document.getElementById('submit-msg'),
            leaderboardTable: document.getElementById('leaderboard-table'),
            leaderboardBody: document.getElementById('leaderboard-body'),
            leaderboardLoading: document.getElementById('leaderboard-loading')
        };

        this.setupEventListeners();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Add any custom event listeners here
        window.addEventListener('scoreUpdate', (e) => this.updateScoreboard(e.detail));
        window.addEventListener('lyricUpdate', (e) => this.updateLyrics(e.detail));
        window.addEventListener('leaderboardLoaded', (e) => this.renderLeaderboard(e.detail));
    }

    /**
     * Show a specific screen
     * @param {string} screenName - Screen ID name
     */
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('overlay')) {
                el.style.display = 'none';
            }
        });

        // Show requested screen
        if (this.elements[screenName]) {
            this.elements[screenName].style.display = 'flex';
            this.currentScreen = screenName;
        }
    }

    /**
     * Update scoreboard display
     * @param {Object} gameState - Current game state
     */
    updateScoreboard(gameState) {
        if (this.elements.scoreBoard) {
            this.elements.scoreBoard.innerText = `S: ${gameState.score}`;
        }
        if (this.elements.comboBoard) {
            this.elements.comboBoard.innerText = `C: x${gameState.combo}`;
        }
    }

    /**
     * Update lyrics display
     * @param {string} text - Lyric text to display
     */
    updateLyrics(text) {
        if (this.elements.lyricsContainer) {
            this.elements.lyricsContainer.innerHTML = `<div class="lyric-line lyric-active">${text}</div>`;
        }
    }

    /**
     * Render leaderboard table
     * @param {Object} detail - { scores: [], highlight: {} }
     */
    renderLeaderboard(detail) {
        const { scores, highlight } = detail;
        const body = this.elements.leaderboardBody;
        const table = this.elements.leaderboardTable;
        const loading = this.elements.leaderboardLoading;

        body.innerHTML = '';

        // Hide loading indicator and show table
        if (loading) loading.style.display = 'none';
        if (table) table.classList.remove('hidden');

        if (!scores || scores.length === 0) {
            body.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500">No scores yet</td></tr>';
            return;
        }

        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            let classes = 'leaderboard-row';

            if (index === 0) {
                classes += ' highlight';
            }

            if (highlight && Number(score.value) === Number(highlight.score) &&
                (!highlight.name || String(score.name).toLowerCase() === String(highlight.name).toLowerCase())) {
                classes += ' you';
            }

            row.className = classes;
            row.innerHTML = `
                <td class="text-center font-bold">${index + 1}</td>
                <td class="font-bold">${(score.name || 'Stray').substring(0, 10)}</td>
                <td class="text-right font-bold">${score.value}</td>
            `;
            body.appendChild(row);
        });
    }

    /**
     * Show game over screen with results
     * @param {Object} gameState - Final game state
     */
    showGameOver(gameState) {
        if (this.elements.finalScore) {
            this.elements.finalScore.innerText = gameState.score;
        }
        if (this.elements.maxCombo) {
            this.elements.maxCombo.innerText = gameState.maxCombo;
        }

        // Calculate and show rank
        this.updateRank(gameState);

        this.showScreen('gameOverScreen');
    }

    /**
     * Update rank display based on percentage
     * @param {Object} gameState - Game state with notes and score
     */
    updateRank(gameState) {
        if (!this.elements.rankText) return;

        const maxPossibleScore = gameState.notes.length * 100;
        const percentage = maxPossibleScore > 0 ? gameState.score / maxPossibleScore : 0;

        const rank = CONFIG.RANKS.find(r => percentage > r.threshold)?.name || "Drowned Alley-Scamp";
        this.elements.rankText.innerText = rank;
    }

    /**
     * Reset submit form
     */
    resetSubmitForm() {
        if (this.elements.playerNameInput) {
            this.elements.playerNameInput.value = '';
            this.elements.playerNameInput.disabled = false;
        }
        if (this.elements.submitScoreBtn) {
            this.elements.submitScoreBtn.disabled = false;
            this.elements.submitScoreBtn.innerText = "Save to Leaderboard!";
        }
        if (this.elements.submitMsg) {
            this.elements.submitMsg.classList.add('hidden');
            this.elements.submitMsg.innerText = '';
        }
    }

    /**
     * Show submit screen or leaderboard based on eligibility
     * @param {boolean} isEligible - Whether score is eligible
     * @param {Object} leaderboard - Leaderboard manager instance
     */
    showPostGameScreen(isEligible, leaderboard) {
        this.resetSubmitForm();

        if (isEligible) {
            // Show submit screen first
            this.elements.submitScreen.style.display = 'block';
            this.elements.leaderboardScreen.style.display = 'none';
        } else {
            // Directly show leaderboard
            this.elements.submitScreen.style.display = 'none';
            this.elements.leaderboardScreen.style.display = 'block';
            if (this.elements.submitMsg) {
                this.elements.submitMsg.classList.remove('hidden');
                this.elements.submitMsg.innerText = 'Not a Top 5 score — cannot save.';
            }
        }
    }
}
