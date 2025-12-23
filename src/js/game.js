/**
 * game.js
 * Core game engine and logic for I-mog-en: The Mewsical
 */

class GameEngine {
    constructor() {
        this.gameState = {
            isPlaying: false,
            startTime: 0,
            score: 0,
            combo: 0,
            maxCombo: 0,
            notes: [],
            lyrics: [],
            particles: [],
            laneCount: CONFIG.GAME.LANE_COUNT,
            speed: CONFIG.GAME.BASE_SPEED,
            hitY: 0
        };
        
        this.canvas = null;
        this.ctx = null;
        this.audioEngine = null;
        this.animationFrameId = null;
        this.floatingTexts = [];
        this.activeLanes = [false, false, false, false];
        this.pawStamps = [];
        this.pawImage = new Image();
        // Load paw image from config; allow cross-origin so canvas drawing isn't tainted
        try {
            this.pawImage.crossOrigin = 'anonymous';
            this.pawImage.src = CONFIG.AUDIO.PAW_IMAGE_URL;
        } catch (e) {
            console.warn('Failed to set paw image src:', e);
        }
    }

    /**
     * Initialize the game canvas and context
     */
    initCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize canvas to fit container
     */
    resize() {
        if (this.canvas) {
            this.canvas.width = this.canvas.parentElement.offsetWidth;
            this.canvas.height = this.canvas.parentElement.offsetHeight;
            this.gameState.hitY = this.canvas.height - 100;
        }
    }

    /**
     * Parse a song into game notes and lyrics
     * @param {string} songId - The ID of the song to parse
     * @returns {Object} { notes: [], lyrics: [] }
     */
    parseSong(songId) {
        const song = SONGS[songId];
        if (!song) return { notes: [], lyrics: [] };

        const beatTime = 60 / song.bpm;
        let currentNoteTime = 2.0;

        const gameNotes = song.notes.map((n, index) => {
            if (!n || typeof n[0] !== 'string' || typeof n[1] !== 'number' || n[1] <= 0) {
                return null;
            }

            const duration = n[1];
            const freq = NOTE_FREQS[n[0]];

            // Skip unknown notes to prevent NaN playbackRate errors
            if (typeof freq === 'undefined') {
                console.warn('Skipping unknown note:', n[0]);
                currentNoteTime += duration * beatTime;
                return null;
            }

            let lane = index % 4;
            if (index % 3 === 0) lane = (lane + 1) % 4;
            if (n[0].indexOf('5') > -1 || n[0].indexOf('6') > -1) lane = 3;
            if (n[0].indexOf('2') > -1) lane = 0;

            const noteObj = {
                time: currentNoteTime,
                lane: lane,
                freq: freq,
                duration: duration * beatTime,
                played: false,
                hit: false,
                missed: false,
                visible: true
            };

            currentNoteTime += duration * beatTime;
            return noteObj;
        }).filter(n => n !== null);

        const gameLyrics = song.lyrics ? song.lyrics.map(l => ({
            time: 2.0 + (l.beat * beatTime),
            text: l.text,
            shown: false
        })) : [];

        return { notes: gameNotes, lyrics: gameLyrics };
    }

    /**
     * Start a new game with selected song
     * @param {string} selectedSongId - The ID of the selected song
     */
    startGame(selectedSongId) {
        if (!this.audioEngine) {
            console.warn('Audio engine not initialized');
            return;
        }

        this.audioEngine.playUISound();
        this.audioEngine.init();

        const songData = this.parseSong(selectedSongId);
        this.gameState = {
            isPlaying: true,
            startTime: this.audioEngine.getCurrentTime(),
            score: 0,
            combo: 0,
            maxCombo: 0,
            notes: songData.notes,
            lyrics: songData.lyrics,
            particles: [],
            laneCount: CONFIG.GAME.LANE_COUNT,
            speed: CONFIG.GAME.BASE_SPEED,
            hitY: this.gameState.hitY
        };

        this.floatingTexts = [];
        this.pawStamps = [];

        window.dispatchEvent(new CustomEvent('gameStart', { detail: this.gameState }));
        this.gameLoop();
    }

    /**
     * Main game loop
     */
    gameLoop = () => {
        if (!this.gameState.isPlaying || !this.ctx || !this.canvas || !this.audioEngine) {
            this.animationFrameId = requestAnimationFrame(this.gameLoop);
            return;
        }

        const AE = this.audioEngine;
        const audioTime = AE.getCurrentTime();
        const gameTime = audioTime - this.gameState.startTime;
        const laneWidth = this.canvas.width / this.gameState.laneCount;
        const hitZoneTop = this.gameState.hitY;

        // Draw background
        const grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grd.addColorStop(0, "#FFFFFF");
        grd.addColorStop(1, "#FFE4E1");
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update lyrics
        this.gameState.lyrics.forEach(lyric => {
            if (!lyric.shown && gameTime >= lyric.time) {
                lyric.shown = true;
                window.dispatchEvent(new CustomEvent('lyricUpdate', { detail: lyric.text }));
            }
        });

        // Draw lanes
        for (let i = 0; i < this.gameState.laneCount; i++) {
            const laneGrd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            laneGrd.addColorStop(0, "rgba(255,255,255,0)");
            laneGrd.addColorStop(1, "rgba(255,255,255,0.1)");
            this.ctx.fillStyle = laneGrd;
            this.ctx.fillRect(i * laneWidth, 0, laneWidth, this.canvas.height);

            this.ctx.strokeStyle = "rgba(90, 24, 154, 0.2)";
            this.ctx.beginPath();
            this.ctx.moveTo(i * laneWidth, 0);
            this.ctx.lineTo(i * laneWidth, this.canvas.height);
            this.ctx.stroke();

            const targetHeight = this.canvas.height - hitZoneTop;
            this.ctx.fillStyle = "rgba(236, 72, 153, 0.15)";
            this.ctx.fillRect(i * laneWidth, hitZoneTop, laneWidth, targetHeight);

            if (this.activeLanes[i]) {
                this.ctx.fillStyle = CONFIG.GAME.LANE_COLORS[i];
                this.ctx.fillRect(i * laneWidth, hitZoneTop, laneWidth, targetHeight);
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = CONFIG.GAME.LANE_COLORS[i];
            }
            this.ctx.shadowBlur = 0;

            this.ctx.strokeStyle = this.activeLanes[i] ? "#000" : CONFIG.GAME.LANE_COLORS[i];
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(i * laneWidth, hitZoneTop);
            this.ctx.lineTo((i + 1) * laneWidth, hitZoneTop);
            this.ctx.stroke();
        }

        // Draw notes
        let allNotesFinished = true;
        this.gameState.notes.forEach(note => {
            const timeDiff = note.time - gameTime;
            const y = hitZoneTop - (timeDiff * this.gameState.speed);

            if (timeDiff <= 0 && !note.played) {
                AE.playMeow(note.freq);
                note.played = true;
            }

            if (y > this.canvas.height + 50 && !note.hit && !note.missed) {
                note.missed = true;
                note.visible = false;
                this.gameState.combo = 0;
                window.dispatchEvent(new CustomEvent('scoreUpdate', { detail: this.gameState }));
                this.createFloatingText("Hiss", note.lane * laneWidth + laneWidth / 2, hitZoneTop + 50, "#5A189A");
                AE.playHitSound('miss');
            }

            if (note.visible && y > -50 && y < this.canvas.height + 50) {
                allNotesFinished = false;
                const x = note.lane * laneWidth + laneWidth / 2;
                const item = CONFIG.GAME.LANE_ITEMS[note.lane];

                this.ctx.font = '60px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.globalAlpha = 1.0;
                this.ctx.shadowColor = CONFIG.GAME.LANE_COLORS[note.lane];
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = "#000";
                this.ctx.fillText(item, x, y);
                this.ctx.shadowBlur = 0;
            } else if (!note.missed && !note.hit && note.time > gameTime) {
                allNotesFinished = false;
            }
        });

        // Draw particles
        this.drawParticles();

        // Draw paw stamps
        this.drawPawStamps(laneWidth);

        // Draw floating text
        this.drawFloatingText();

        // Check if song is finished
        if (allNotesFinished && this.gameState.notes.length > 0) {
            if (gameTime > this.gameState.notes[this.gameState.notes.length - 1].time + 1.5) {
                this.endGame();
                return;
            }
        }

        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    };

    /**
     * Handle player input on a lane
     * @param {number} lane - Lane index (0-3)
     */
    handleInput(lane) {
        if (!this.gameState.isPlaying || !this.audioEngine) return;

        this.activeLanes[lane] = true;
        setTimeout(() => { this.activeLanes[lane] = false; }, 100);

        const AE = this.audioEngine;
        const gameTime = AE.getCurrentTime() - this.gameState.startTime;
        const laneWidth = this.canvas.width / this.gameState.laneCount;
        const x = lane * laneWidth + laneWidth / 2;
        const yStamp = this.gameState.hitY + 50;

        this.createPawStamp(lane, x, yStamp, CONFIG.GAME.LANE_COLORS[lane]);

        const candidates = this.gameState.notes.filter(n =>
            n.lane === lane && !n.hit && !n.missed && Math.abs(n.time - gameTime) < CONFIG.GAME.HIT_WINDOW
        );

        if (candidates.length > 0) {
            const note = candidates[0];
            const diff = Math.abs(note.time - gameTime);
            note.hit = true;
            note.visible = false;

            let scoreMessage;
            if (diff < CONFIG.SCORING.PERFECT_THRESHOLD) {
                scoreMessage = 'PERFECT';
            } else if (diff < CONFIG.SCORING.GOOD_THRESHOLD) {
                scoreMessage = 'GOOD';
            } else {
                scoreMessage = 'MEH';
            }

            this.applyScore(scoreMessage, x, lane, AE);
        }
    }

    /**
     * Apply score and combo for a hit
     */
    applyScore(scoreType, x, lane, audioEngine) {
        const msg = SCORE_MESSAGES[scoreType];
        let scoreDelta = 0;
        let comboDelta = 0;

        if (scoreType === 'PERFECT') {
            scoreDelta = CONFIG.SCORING.PERFECT_SCORE + (this.gameState.combo * 5);
            comboDelta = 1;
            audioEngine.playHitSound('perfect');
        } else if (scoreType === 'GOOD') {
            scoreDelta = CONFIG.SCORING.GOOD_SCORE + (this.gameState.combo * 2);
            comboDelta = 1;
            audioEngine.playHitSound('good');
        } else {
            scoreDelta = CONFIG.SCORING.MEH_SCORE;
            comboDelta = -this.gameState.combo;
            audioEngine.playHitSound('meh');
        }

        this.gameState.combo = Math.max(0, this.gameState.combo + comboDelta);
        this.gameState.score += scoreDelta;
        if (this.gameState.combo > this.gameState.maxCombo) {
            this.gameState.maxCombo = this.gameState.combo;
        }

        window.dispatchEvent(new CustomEvent('scoreUpdate', { detail: this.gameState }));
        this.createFloatingText(msg.text, x, this.gameState.hitY - 30, msg.color);
        this.spawnParticles(x, this.gameState.hitY + 50, CONFIG.GAME.LANE_COLORS[lane]);
    }

    /**
     * End the game
     */
    endGame() {
        this.gameState.isPlaying = false;
        cancelAnimationFrame(this.animationFrameId);
        
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('gameEnd', { detail: this.gameState }));
        }, 500);
    }

    /**
     * Helper methods for visual effects
     */
    createFloatingText(text, x, y, color) {
        this.floatingTexts.push({ text, x, y, color, life: 1.0 });
    }

    spawnParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.gameState.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1.0,
                color
            });
        }
    }

    createPawStamp(lane, x, y, color) {
        if (!this.pawImage.complete) return;
        this.pawStamps.push({
            lane, x, y: y + 20,
            rotation: (Math.random() - 0.5) * 0.7,
            size: 90 + Math.random() * 30,
            life: 1.0,
            color
        });
    }

    drawParticles() {
        for (let i = this.gameState.particles.length - 1; i >= 0; i--) {
            const p = this.gameState.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.8;
            p.life -= 0.04;

            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            if (p.life <= 0) this.gameState.particles.splice(i, 1);
        }
    }

    drawPawStamps(laneWidth) {
        for (let i = this.pawStamps.length - 1; i >= 0; i--) {
            const stamp = this.pawStamps[i];
            stamp.life -= 0.03;

            if (stamp.life <= 0) {
                this.pawStamps.splice(i, 1);
                continue;
            }

            const laneX = stamp.lane * laneWidth;
            this.ctx.globalAlpha = Math.max(0, stamp.life * 0.7);
            this.ctx.fillStyle = stamp.color;
            this.ctx.fillRect(laneX, this.gameState.hitY, laneWidth, this.canvas.height - this.gameState.hitY);
            this.ctx.globalAlpha = 1;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, stamp.life);
            this.ctx.translate(stamp.x, stamp.y);
            this.ctx.rotate(stamp.rotation);
            if (this.pawImage.complete) {
                this.ctx.filter = `drop-shadow(0 0 5px ${stamp.color})`;
                this.ctx.drawImage(this.pawImage, -stamp.size / 2, -stamp.size / 2, stamp.size, stamp.size);
            }
            this.ctx.filter = 'none';
            this.ctx.restore();
            this.ctx.globalAlpha = 1;
        }
    }

    drawFloatingText() {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 2;
            ft.life -= 0.03;

            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
                continue;
            }

            this.ctx.globalAlpha = Math.max(0, ft.life);
            this.ctx.save();
            this.ctx.translate(ft.x, ft.y);
            const scale = 1 + (1 - ft.life) * 0.5;
            this.ctx.scale(scale, scale);
            this.ctx.font = "40px 'Bangers'";
            this.ctx.textAlign = "center";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(ft.text, 0, 0);
            this.ctx.fillStyle = ft.color;
            this.ctx.fillText(ft.text, 0, 0);
            this.ctx.restore();
            this.ctx.globalAlpha = 1;
        }
    }
}
