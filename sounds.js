// ================================================
// CLOCKLY - SOUNDS LIBRARY
// Royalty-Free Procedural Audio Tones
// ================================================

// Web Audio API for generating tones
function playTone(frequencies, durations) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let currentTime = audioContext.currentTime;
    
    frequencies.forEach((freq, index) => {
      if (freq === 0) {
        // Silence period
        currentTime += durations[index] / 1000;
      } else {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + durations[index] / 1000);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + durations[index] / 1000);
        
        currentTime += durations[index] / 1000;
      }
    });
  } catch (error) {
    console.log('Audio API not supported');
  }
}

// ================================================
// 20+ TIMER SOUNDS (Royalty-Free)
// ================================================

const timerSounds = {
  // Classic Sounds
  'Bell': () => playTone([800, 1200, 800], [0.1, 0.1, 0.2]),
  'Beep': () => playTone([1000, 0, 1000, 0, 1000], [0.1, 0.1, 0.1, 0.1, 0.2]),
  'Chime': () => playTone([523.25, 659.25, 783.99], [0.2, 0.2, 0.3]),
  'Alarm': () => playTone([800, 900, 800, 900], [0.15, 0.15, 0.15, 0.3]),
  'Notification': () => playTone([1320, 1760], [0.1, 0.2]),
  
  // Fun Sounds
  'Pop': () => playTone([800, 400], [0.05, 0.15]),
  'Ping': () => playTone([1046.50, 1318.51], [0.08, 0.15]),
  'Digital': () => playTone([1200, 800, 1200, 800], [0.08, 0.08, 0.08, 0.2]),
  'Ding': () => playTone([659.25, 783.99, 987.77], [0.15, 0.15, 0.3]),
  'Alert': () => playTone([880, 660, 880, 660], [0.1, 0.1, 0.1, 0.2]),
  
  // Musical Sounds
  'Retro': () => playTone([440, 494.88, 523.25, 587.33], [0.1, 0.1, 0.1, 0.3]),
  'Synth': () => playTone([523.25, 659.25, 783.99, 987.77], [0.12, 0.12, 0.12, 0.24]),
  'Twinkle': () => playTone([392, 392, 392, 294, 330, 349], [0.1, 0.1, 0.1, 0.1, 0.1, 0.2]),
  'Whistle': () => playTone([1046.50, 1318.51, 1567.98], [0.15, 0.15, 0.3]),
  
  // Nature Sounds
  'Thunder': () => playTone([100, 150, 120], [0.2, 0.2, 0.4]),
  
  // Additional Sounds
  'Sparkle': () => playTone([1500, 1000, 1500, 1000], [0.08, 0.08, 0.08, 0.16]),
  'Cascade': () => playTone([1046.50, 932.33, 830.61, 739.99], [0.1, 0.1, 0.1, 0.2]),
  'Boing': () => playTone([200, 400, 600], [0.08, 0.1, 0.2]),
  'Swoosh': () => playTone([300, 600, 400, 200], [0.05, 0.05, 0.05, 0.15]),
  'Tick': () => playTone([2000, 0, 2000], [0.05, 0.05, 0.1]),
};

// ================================================
// SOUND METADATA
// ================================================

const soundMetadata = {
  // Sound Attribution
  sounds: {
    type: 'Procedurally Generated',
    method: 'Web Audio API (Sine Wave Oscillations)',
    license: 'Royalty Free - No Copyright',
    description: '20+ unique tones generated via Web Audio API',
    count: Object.keys(timerSounds).length
  },
  
  // Compliance
  copyright: {
    status: 'All sounds are procedurally generated - NO copyright issues',
    compliance: 'No third-party audio files used - 100% original generated content',
    license_type: 'CC0 Public Domain (Generated Content)',
    attribution_required: false
  },
  
  // Sound Categories
  categories: {
    'Classic': ['Bell', 'Beep', 'Chime', 'Alarm', 'Notification'],
    'Fun': ['Pop', 'Ping', 'Digital', 'Ding', 'Alert'],
    'Musical': ['Retro', 'Synth', 'Twinkle', 'Whistle'],
    'Nature': ['Thunder'],
    'Modern': ['Sparkle', 'Cascade', 'Boing', 'Swoosh', 'Tick']
  }
};

// ================================================
// SOUND SELECTOR HELPER
// ================================================

function getSoundList() {
  return Object.keys(timerSounds);
}

function playSound(soundName) {
  if (timerSounds[soundName]) {
    timerSounds[soundName]();
    return true;
  } else {
    console.warn(`Sound '${soundName}' not found. Available sounds:`, getSoundList());
    return false;
  }
}

// ================================================
// EXPORT FOR USE IN OTHER FILES
// ================================================

// For global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { timerSounds, soundMetadata, playTone, playSound, getSoundList };
}