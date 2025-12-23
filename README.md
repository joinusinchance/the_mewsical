# I-mog-en: The Mewsical (Reprise)

A vibrant, browser-based rhythm action game featuring I-mog-en the cat and 5 classic melodies. Hit the notes in sync with the music to rack up points and claim a spot on the leaderboard!

## Features

- 🎵 **5 Annoying Songs**: Camptown Races, Ode to Joy, The Entertainer, Korobeiniki (Tetris), Hall of the Mountain King
- 🎮 **Dual Input**: Keyboard (D-F-J-K) and touch/mouse controls
- 🏆 **Global Leaderboard**: Submit your scores and compete with other players
- 📱 **Mobile Responsive**: Optimized for desktop and mobile devices
- ✨ **Retro Bubblegum Aesthetic**: Colorful, animated UI with fun fonts and effects

## Project Structure

```
the-mewsical-reprise/
├── index.html                 # Main HTML entry point
├── package.json              # Project metadata and dependencies
├── README.md                 # This file
└── src/
    ├── css/
    │   └── styles.css        # All CSS styles and animations
    ├── js/
    │   ├── config.js         # Game constants, API config, note frequencies
    │   ├── audio.js          # Web Audio API engine
    │   ├── game.js           # Core game engine and logic
    │   ├── leaderboard.js    # Leaderboard manager and UI manager
    │   └── main.js           # Application entry point and event wiring
    └── data/
        └── songs.js          # All song data, note sequences, and lyrics
```

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3+ (for local development server, optional)

### Local Development

1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/the-mewsical-reprise.git
   cd the-mewsical-reprise
   ```

2. Start a local development server
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js (if installed)
   npx http-server
   ```

3. Open your browser to `http://localhost:8000`

## How to Play

### Controls
- **Keyboard**: Press `D`, `F`, `J`, or `K` to hit notes
- **Touch**: Tap the four lanes on your screen
- **Mouse**: Click the four lanes

### Gameplay
1. Select a song from the dropdown menu
2. Click "Play Now!" to start
3. Hit the notes when they reach the target zone at the bottom
4. Build combos for extra points
5. Complete the song and submit your score to the leaderboard

### Scoring
- **PURRFECT!** (≤0.1s off): 100 points + combo multiplier
- **Grrreat!** (≤0.25s off): 50 points + combo multiplier
- **Mew** (>0.25s off): 10 points, combo breaks
- **Miss**: Combo resets, no points

### Rank System
Your final rank depends on your accuracy:
- **99.9%+**: Pop Star Purrfection!
- **90-99.8%**: Nine-Life Legend
- **80-89%**: The Gilded Aristocat
- **70-79%**: Grand Claw-mander
- **60-69%**: Premier Purr-former
- **50-59%**: Silver-Whiskered Specialist
- **40-49%**: Sofa-Sultan
- **30-39%**: Barnyard Mouser
- **20-29%**: Flea-Bitten Stray
- **10-19%**: Sewer-Sodden Scruff
- **<10%**: Drowned Alley-Scamp

## Architecture

### Modular Design
This project is organized into logical modules for maintainability:

- **config.js**: Central configuration for game constants, frequencies, API endpoints
- **audio.js**: Web Audio API wrapper for sound effects and note playback
- **game.js**: GameEngine class handling core game loop, note rendering, scoring
- **leaderboard.js**: LeaderboardManager and UIManager classes for API and UI
- **main.js**: Application initialization and event wiring

### API Integration
The game uses a remote leaderboard API at `https://lb.yogurtthehor.se/api/v1`:
- **GET** `/scores/{leaderboardId}/{limit}`: Fetch top scores
- **POST** `/scores/{leaderboardId}/{secret}/add/{name}/{score}/0`: Submit score

### Audio System
- Uses Web Audio API for low-latency sound synthesis
- Supports frequency-based note playback with sample-based meow sounds
- Includes UI feedback sounds and hit effect oscillators

## Customization

### Adding New Songs
Edit `src/data/songs.js`:
```javascript
const my_song_notes = [['C4', 1], ['D4', 1], ...];
const my_song_lyrics = [{beat: 0, text: "Verse 1"}, ...];

const SONGS = {
    ...
    'mysong': {
        id: 'mysong',
        name: 'My Song',
        bpm: 120,
        notes: my_song_notes,
        lyrics: my_song_lyrics
    }
};
```

### Modifying Styling
Edit `src/css/styles.css` to customize colors, fonts, animations, and responsive breakpoints.

### Adjusting Game Difficulty
In `src/js/config.js`:
- `GAME.BASE_SPEED`: How fast notes fall (higher = harder)
- `GAME.HIT_WINDOW`: Time window for hitting notes (smaller = harder)
- `SCORING.*`: Point values for different hit qualities

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

## Known Limitations

- Audio synthesis quality depends on browser's Web Audio API implementation
- Leaderboard functionality requires internet connection
- Very old devices may have performance issues with animations

## Future Enhancements

- [ ] Multiplayer / duet modes
- [ ] Custom song upload
- [ ] Practice mode with note hints
- [ ] Sound customization options
- [ ] Difficulty levels
- [ ] Achievement system
- [ ] Theme customization
- [ ] Offline score tracking

## Credits

- **Code**: 100% No natural coding inside (Gemini, Claude & ChatGPT)
- **Songs**: Public domain classical and folk melodies. 
- **Audio**: Web Audio API with custom synthesis
- **Leaderboard API**: Externally hosted leaderboard API. Thanks yogurtthehorse
- **Fonts**: Luckiest Guy and Bangers from Google Fonts
- **Art**: Cat and paw images from google gemini AI slop


## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For issues, feature requests, or general questions, please open an issue on GitHub.

---

**Enjoy**
