/**
 * audio.js
 * Web Audio API engine for sound effects and note playback
 */

class AudioEngine {
    constructor() {
        this.audioCtx = null;
        this.masterGain = null;
        this.meowBuffer = null;
        this.fxBuffer = null;
    }

    /**
     * Initialize the audio context and load audio assets
     */
    async init() {
        if (this.audioCtx) return; // Already initialized

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = CONFIG.AUDIO.MASTER_GAIN;
        this.masterGain.connect(this.audioCtx.destination);

        // Load audio files in parallel
        await Promise.all([
            this.loadAudioFile(CONFIG.AUDIO.MEOW_URL, 'meow'),
            this.loadAudioFile(CONFIG.AUDIO.FX_URL, 'fx')
        ]);

        // Load paw image
        const pawImage = new Image();
        pawImage.src = CONFIG.AUDIO.PAW_IMAGE_URL;
    }

    /**
     * Load an audio file and decode it
     */
    async loadAudioFile(url, type) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.audioCtx.decodeAudioData(arrayBuffer);

            if (type === 'meow') {
                this.meowBuffer = buffer;
            } else if (type === 'fx') {
                this.fxBuffer = buffer;
            }
        } catch (error) {
            console.warn(`Failed to load audio (${type}):`, error);
        }
    }

    /**
     * Resume audio context if suspended (required for user interaction)
     */
    resume() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    /**
     * Play a meow sound at a specific frequency (note)
     * @param {number} freq - Frequency in Hz
     */
    playMeow(freq) {
        if (!this.audioCtx || !this.meowBuffer) return;

        const source = this.audioCtx.createBufferSource();
        source.buffer = this.meowBuffer;
        source.playbackRate.value = (freq / CONFIG.AUDIO.BASE_FREQUENCY) * CONFIG.AUDIO.OCTAVE_OFFSET;

        const gain = this.audioCtx.createGain();
        source.connect(gain);
        gain.connect(this.masterGain);
        source.start(0);
    }

    /**
     * Play UI sound (button click, etc)
     */
    playUISound() {
        if (!this.audioCtx || !this.fxBuffer) return;

        const source = this.audioCtx.createBufferSource();
        source.buffer = this.fxBuffer;
        source.connect(this.masterGain);
        source.start(0);
    }

    /**
     * Play hit feedback sound
     * @param {string} type - 'perfect', 'good', or 'miss'
     */
    playHitSound(type) {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.audioCtx.currentTime;

        if (type === 'perfect') {
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        } else if (type === 'miss') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        } else {
            // 'good' or default
            osc.frequency.setValueAtTime(440, now);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        }

        osc.start();
        osc.stop(now + 0.2);
    }

    /**
     * Get current audio context time
     */
    getCurrentTime() {
        return this.audioCtx ? this.audioCtx.currentTime : 0;
    }

    /**
     * Set master volume
     * @param {number} value - Volume 0.0 to 1.0
     */
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }
}
