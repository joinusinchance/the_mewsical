/**
 * songs.js
 * Contains all song data, lyrics, and note sequences for the game.
 */

// 1. CAMPTOWN RACES (110 BPM)
const camptown_verse = [
    ['G4',1],['G4',1],['E4',1],['G4',1], ['A4',1],['G4',1],['E4',2],['E4',1],['D4',3], ['E4',1],['D4',3],
    ['G4',1],['G4',1],['E4',1],['G4',1], ['A4',1],['G4',1],['E4',2],['D4',1], ['F4',1],['E4',1],['D4',1],['C4',2],
];
const camptown_chorus = [['D4',1],['D4',1],['D4',1],['E4',1], ['F4',1],['E4',1],['D4',2], ['C4',1],['D4',1],['E4',1],['C4',1], ['G3',4]];
const camptown_full = [].concat(camptown_verse, camptown_chorus, camptown_verse);
const camptown_lyrics_full = [
    {beat: 0, text: "Camptown ladies sing this song, Doo-dah, Doo-dah!"}, 
    {beat: 8, text: "Camptown race-track five miles long, Oh, doo-dah day!"},
    {beat: 16, text: "Goin' to run all night, Goin' to run all day,"}, 
    {beat: 24, text: "I'll bet my money on the bob-tail nag, somebody bet on the bay."}
];

// 2. ODE TO JOY
const ode_a = [['E4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1], ['C4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1.5], ['D4', 0.5], ['D4', 2]];
const ode_b = [['E4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1], ['C4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['D4', 1.5], ['C4', 0.5], ['C4', 2]];
const ode_c = [['D4', 1], ['D4', 1], ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 0.5],['F4', 0.5], ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 0.5],['F4', 0.5], ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['G3', 2]];
const ode_full = [].concat(ode_a, ode_b, ode_c, ode_b); 
const ode_lyrics_full = [ {beat: 0, text: "Joy, beautiful spark of Divinity"}, {beat: 16, text: "We enter, drunk with fire"}, {beat: 32, text: "Your magic joins again"}, {beat: 48, text: "All men become brothers"} ];

// 3. THE ENTERTAINER
const entertainer_part_a = [['D5',0.5],['E5',0.5],['C5',0.5],['A5',1],['B5',0.5],['G4',1], ['D4', 0.5], ['E4', 0.5], ['C4', 0.5], ['A4', 1], ['B4', 0.5], ['G3',1],['D3',0.5],['E3',0.5],['C3',0.5],['A3',1],['B3',0.5], ['A3', 0.5], ['B#3', 0.5], ['G3', 2], ['G4', 1]];
const entertainer_part_b = [['D4', 0.5], ['D#4',0.5],['E4',0.5],['C4',1],['E4',0.5],['C4',1],['E4',0.5],['C4',3],['C4',0.5],['D4',0.5],['D#4',0.5],['E4',0.5], ['C4',0.5],['D4',0.5],['E4',1],['B4',0.5],['D4',1], ['C4', 3]];
const entertainer_part_c = [['D4', 0.5], ['D#4',0.5],['E4',0.5],['C4',1],['E4',0.5],['C4',1],['E4',0.5],['C4',3],['A4',0.5],['G3',0.5],['F#3',0.5],['A4',0.5], ['C4',0.5],['E4',1],['D4',0.5],['C4',0.5],['A4',0.5], ['D4', 3]];
const entertainer_part_d = [['D4', 0.5], ['E4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 0.5], ['F4', 1], ['D4', 0.5], ['E4', 0.5], ['D4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 0.5], ['F4', 1], ['D4', 0.5], ['E4', 0.5], ['D4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 0.5], ['F4', 1], ['B4', 0.5], ['D4', 0.5], ['C4', 3]];
const entertainer_full = [].concat(entertainer_part_a, entertainer_part_b, entertainer_part_c, entertainer_part_b, entertainer_part_d, ['C4', 4]); 
const entertainer_lyrics_full = [{beat: 0, text: "Ragtime Intro..."}, {beat: 16, text: "Sliding on the keys"}, {beat: 32, text: "The Trio begins"}, {beat: 64, text: "Back to the main theme"}];

// 4. KOROBEINIKI
const korobeiniki_part_a = [['E4', 1], ['B3', 0.5], ['C4', 0.5], ['D4', 1], ['C4', 0.5], ['B3', 0.5], ['A3', 1], ['A3', 0.5], ['C4', 0.5], ['E4', 1], ['D4', 0.5], ['C4', 0.5], ['B3', 1], ['B3', 0.5], ['C4', 0.5], ['D4', 1], ['E4', 1], ['C4', 1], ['A3', 1], ['A3', 1]];
const korobeiniki_part_b = [['D4', 1.5], ['F4', 0.5], ['A4', 1], ['G4', 0.5], ['F4', 0.5], ['E4', 1.5], ['C4', 0.5], ['E4', 1], ['D4', 0.5], ['C4', 0.5], ['B3', 1], ['B3', 0.5], ['C4', 0.5], ['D4', 1], ['E4', 1], ['C4', 1], ['A3', 1], ['A3', 1]];
const korobeiniki_full = [].concat(korobeiniki_part_a, korobeiniki_part_b, korobeiniki_part_a, korobeiniki_part_b, ['E4', 2], ['C4', 2], ['A3', 4]); 
const korobeiniki_lyrics_full = [{beat: 0, text: "Tetris time!"}, {beat: 16, text: "Keep up!"}, {beat: 32, text: "Faster!"}, {beat: 48, text: "Stack 'em high!"}];

// 5. HALL OF THE MOUNTAIN KING
const mountain_part_a = [['B3',0.5],['C#4',0.5],['D4',0.5],['E4',0.5],['F#4',0.5],['D4',0.5],['F#4',1], ['F#4',0.5],['D4',0.5],['F#4',1], ['F#4',0.5],['D4',0.5],['F#4',1], ['B3',0.5],['C#4',0.5],['D4',0.5],['E4',0.5],['F#4',0.5],['D4',0.5],['F#4',1], ['A4',0.5],['G4',0.5],['E4',1], ['F#4',0.5],['D4',0.5],['B3',1]];
const mountain_part_b = [['B4',0.5],['C#5',0.5],['D5',0.5],['E5',0.5],['F#5',0.5],['D5',0.5],['F#5',1], ['F#5',0.5],['D5',0.5],['F#5',1], ['F#5',0.5],['D5',0.5],['F#5',1], ['B4',0.5],['C#5',0.5],['D5',0.5],['E5',0.5],['F#5',0.5],['D5',0.5],['F#5',1], ['A5',0.5],['G5',0.5],['E5',1], ['F#5',0.5],['D5',0.5],['B4',1]];
const mountain_full = [].concat(mountain_part_a, mountain_part_b, mountain_part_a, ['B4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F#4', 0.5], ['E4', 4]); 
const mountain_lyrics_full = [{beat: 0, text: "Creeping..."}, {beat: 16, text: "Faster..."}, {beat: 32, text: "Running!"}, {beat: 48, text: "Escape!"}];

/**
 * SONGS object maps song IDs to their metadata and note/lyric data
 */
const SONGS = {
    'camptown': { 
        id: 'camptown',
        name: 'Camptown Races',
        bpm: 110, 
        notes: camptown_full, 
        lyrics: camptown_lyrics_full
    },
    'ode': { 
        id: 'ode',
        name: 'Ode to Joy',
        bpm: 120, 
        notes: ode_full, 
        lyrics: ode_lyrics_full
    },
    'entertainer': { 
        id: 'entertainer',
        name: 'The Entertainer',
        bpm: 140, 
        notes: entertainer_full, 
        lyrics: entertainer_lyrics_full
    },
    'korobeiniki': { 
        id: 'korobeiniki',
        name: 'Korobeiniki (Tetris)',
        bpm: 140, 
        notes: korobeiniki_full, 
        lyrics: korobeiniki_lyrics_full
    },
    'mountain': { 
        id: 'mountain',
        name: 'Hall of Mountain King',
        bpm: 160, 
        notes: mountain_full, 
        lyrics: mountain_lyrics_full
    }
};
