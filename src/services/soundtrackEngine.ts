// High-fidelity Web Audio Soundtrack Synthesizer Engine
// Accurately reproduces iconic themes for Harry Potter, Game of Thrones, and Stranger Things

export type ThemeSlug = 'harry-potter' | 'game-of-thrones' | 'stranger-things';

export interface ThemeMetadata {
  slug: ThemeSlug;
  title: string;
  composer: string;
  franchise: string;
  key: string;
  description: string;
}

export const THEME_METADATA: Record<ThemeSlug, ThemeMetadata> = {
  'harry-potter': {
    slug: 'harry-potter',
    title: "Hedwig's Theme",
    composer: 'John Williams',
    franchise: 'Harry Potter Film Series',
    key: 'E Minor (Celesta & Strings)',
    description: 'Iconic crystalline celesta melody with shimmering harmonics and mystical warmth'
  },
  'game-of-thrones': {
    slug: 'game-of-thrones',
    title: 'Main Title Theme',
    composer: 'Ramin Djawadi',
    franchise: 'Game of Thrones',
    key: 'C Minor (Cello & War Drums)',
    description: 'Dark, driving cello ostinato accompanied by war percussion and noble brass'
  },
  'stranger-things': {
    slug: 'stranger-things',
    title: 'Stranger Things Theme',
    composer: 'Kyle Dixon & Michael Stein',
    franchise: 'Stranger Things',
    key: 'C Major (Analog Synthesizers)',
    description: 'Hypnotic 1980s analog synth arpeggio with breathing resonant filter sweeps and sub-bass'
  }
};

export interface SoundtrackState {
  currentTheme: ThemeSlug | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0 to 1
  autoplayBlocked: boolean;
}

type Listener = (state: SoundtrackState) => void;

class SoundtrackEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private fadeGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private delayFilter: BiquadFilterNode | null = null;

  private currentTheme: ThemeSlug | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.75;
  private autoplayBlocked = false;

  private loopIntervalId: number | null = null;
  private activeVoices: { stop: () => void }[] = [];
  private listeners: Set<Listener> = new Set();
  private userInteractionBound = false;

  constructor() {
    // Setup global gesture listener to resume audio if suspended by browser autoplay policy
    if (typeof window !== 'undefined') {
      this.bindUserInteraction();
    }
  }

  private bindUserInteraction() {
    if (this.userInteractionBound || typeof window === 'undefined') return;
    this.userInteractionBound = true;

    const resumeAudio = async () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
          if (this.isPlaying && this.currentTheme) {
            this.autoplayBlocked = false;
            this.notify();
          }
        } catch {
          // Ignore
        }
      }
    };

    const handler = () => {
      resumeAudio();
      // If we are currently supposed to be playing a theme but were blocked, restart it now
      if (this.currentTheme && !this.isPlaying && this.autoplayBlocked) {
        this.playTheme(this.currentTheme);
      }
    };

    window.addEventListener('pointerdown', handler, { passive: true });
    window.addEventListener('keydown', handler, { passive: true });
    window.addEventListener('touchstart', handler, { passive: true });
  }

  private initAudio() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Compressor for polished broadcast sound
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      // Fade Gain (for smooth fades)
      this.fadeGain = this.ctx.createGain();
      this.fadeGain.gain.setValueAtTime(1, this.ctx.currentTime);

      // Master Gain (for user volume and mute)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      // Spatial Delay & Reverb Ambiance
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.32, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.24, this.ctx.currentTime);

      this.delayFilter = this.ctx.createBiquadFilter();
      this.delayFilter.type = 'lowpass';
      this.delayFilter.frequency.setValueAtTime(2600, this.ctx.currentTime);

      // Routing:
      // Sources -> fadeGain -> compressor -> masterGain -> destination
      // Sources -> delayNode -> delayFilter -> delayFeedback -> delayNode
      // delayFilter -> compressor
      this.fadeGain.connect(this.compressor);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.delayNode.connect(this.delayFilter);
      this.delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayFilter.connect(this.compressor);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        this.autoplayBlocked = true;
        this.notify();
      });
    }
  }

  public primeAudioContext() {
    this.initAudio();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.autoplayBlocked = false;
        this.notify();
      }).catch(() => {});
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public getState(): SoundtrackState {
    return {
      currentTheme: this.currentTheme,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      autoplayBlocked: this.autoplayBlocked
    };
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else if (this.currentTheme) {
      this.playTheme(this.currentTheme);
    }
  }

  public pause() {
    this.stopAudioLoop(true);
    this.isPlaying = false;
    this.notify();
  }

  public resume() {
    if (this.currentTheme) {
      this.playTheme(this.currentTheme);
    }
  }

  private stopAudioLoop(fade: boolean = true) {
    if (this.loopIntervalId !== null) {
      window.clearInterval(this.loopIntervalId);
      this.loopIntervalId = null;
    }

    if (this.ctx && this.fadeGain && fade) {
      const now = this.ctx.currentTime;
      this.fadeGain.gain.cancelScheduledValues(now);
      this.fadeGain.gain.setValueAtTime(this.fadeGain.gain.value, now);
      this.fadeGain.gain.linearRampToValueAtTime(0, now + 0.4);
    }

    setTimeout(() => {
      this.activeVoices.forEach((v) => {
        try {
          v.stop();
        } catch {
          // Ignore
        }
      });
      this.activeVoices = [];

      if (this.fadeGain && this.ctx) {
        this.fadeGain.gain.setValueAtTime(1, this.ctx.currentTime);
      }
    }, fade ? 420 : 0);
  }

  public stopTheme() {
    this.stopAudioLoop(true);
    this.currentTheme = null;
    this.isPlaying = false;
    this.autoplayBlocked = false;
    this.notify();
  }

  public playTheme(slug: ThemeSlug) {
    this.initAudio();

    if (!this.ctx) return;

    // Check if autoplay was suspended
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.autoplayBlocked = false;
        this.notify();
      }).catch(() => {
        this.autoplayBlocked = true;
        this.notify();
      });
    } else {
      this.autoplayBlocked = false;
    }

    // If already playing this theme, keep playing
    if (this.currentTheme === slug && this.isPlaying) {
      return;
    }

    // Stop existing loop
    this.stopAudioLoop(false);

    this.currentTheme = slug;
    this.isPlaying = true;
    this.notify();

    // Start appropriate music loop
    switch (slug) {
      case 'harry-potter':
        this.startHarryPotterLoop();
        break;
      case 'game-of-thrones':
        this.startGameOfThronesLoop();
        break;
      case 'stranger-things':
        this.startStrangerThingsLoop();
        break;
    }
  }

  // =========================================================================
  // 1. HARRY POTTER: HEDWIG'S THEME (Celesta, Shimmer & Orchestral Pad)
  // =========================================================================
  private startHarryPotterLoop() {
    if (!this.ctx || !this.fadeGain) return;

    // Hedwig's Theme in E Minor
    // BPM: 136 in 3/8 meter (beat = 0.44s)
    const beat = 0.44;

    const playSequence = () => {
      if (!this.ctx || !this.isPlaying || this.currentTheme !== 'harry-potter') return;
      const now = this.ctx.currentTime + 0.05;

      // Celestial Pad Chords (Em -> Cmaj7 -> B7 -> Em)
      this.playWarmPad(now, 16 * beat, [164.81, 196.00, 246.94]); // Em
      this.playWarmPad(now + 16 * beat, 16 * beat, [130.81, 164.81, 196.00, 246.94]); // Cmaj7

      // Phrase 1
      let t = now;
      const phrase1: [number, number][] = [
        [493.88, 1.0], // B4
        [659.25, 1.5], // E5
        [783.99, 0.5], // G5
        [739.99, 1.0], // F#5
        [659.25, 2.0], // E5
        [987.77, 1.0], // B5
        [880.00, 2.5], // A5
        [0, 0.5],      // rest
        [739.99, 2.5], // F#5
        [0, 0.5],      // rest
        [659.25, 1.5], // E5
        [783.99, 0.5], // G5
        [739.99, 1.0], // F#5
        [622.25, 2.0], // D#5
        [698.46, 1.0], // F5
        [493.88, 2.5], // B4
        [0, 0.5]       // rest
      ];

      phrase1.forEach(([freq, dur]) => {
        if (freq > 0) {
          this.playCelestaNote(t, dur * beat, freq);
        }
        t += dur * beat;
      });

      // Phrase 2
      const phrase2: [number, number][] = [
        [493.88, 1.0], // B4
        [659.25, 1.5], // E5
        [783.99, 0.5], // G5
        [739.99, 1.0], // F#5
        [659.25, 2.0], // E5
        [987.77, 1.0], // B5
        [1174.66, 2.0], // D6
        [1108.73, 1.0], // C#6
        [1046.50, 2.5], // C6
        [830.61, 1.0],  // G#5
        [1046.50, 1.5], // C6
        [987.77, 0.5],  // B5
        [932.33, 1.0],  // Bb5
        [466.16, 1.5],  // Bb4
        [783.99, 0.5],  // G5
        [659.25, 3.0]   // E5
      ];

      phrase2.forEach(([freq, dur]) => {
        if (freq > 0) {
          this.playCelestaNote(t, dur * beat, freq);
        }
        t += dur * beat;
      });
    };

    // Calculate total duration: ~36 beats * 0.44s ≈ 16 seconds
    const totalCycleMs = 36 * beat * 1000;
    playSequence();
    this.loopIntervalId = window.setInterval(playSequence, totalCycleMs);
  }

  private playCelestaNote(startTime: number, duration: number, freq: number) {
    if (!this.ctx || !this.fadeGain) return;

    // Harmonic Celesta Voice: fundamental sine + 2nd harmonic chime + bell transient
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const bellOsc = this.ctx.createOscillator();

    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(280, startTime);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // 2nd harmonic (octave overtone) for music box bell ring
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.003, startTime);

    // Subtle high bell sparkle
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(freq * 3.01, startTime);

    // Dynamic Chime Envelope
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.35, startTime + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(0.08, startTime + Math.min(0.5, duration));
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(1.2, duration + 0.4));

    osc1.connect(filter);
    osc2.connect(filter);
    bellOsc.connect(filter);

    filter.connect(noteGain);
    noteGain.connect(this.fadeGain);
    if (this.delayNode) {
      noteGain.connect(this.delayNode);
    }

    const stopTime = startTime + Math.max(1.5, duration + 0.5);
    osc1.start(startTime);
    osc2.start(startTime);
    bellOsc.start(startTime);

    osc1.stop(stopTime);
    osc2.stop(stopTime);
    bellOsc.stop(stopTime);

    this.activeVoices.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          bellOsc.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  private playWarmPad(startTime: number, duration: number, frequencies: number[]) {
    if (!this.ctx || !this.fadeGain) return;

    frequencies.forEach((f) => {
      if (!this.ctx || !this.fadeGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.035, startTime + 1.5);
      gain.gain.setValueAtTime(0.035, startTime + duration - 1.2);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.fadeGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);

      this.activeVoices.push({
        stop: () => {
          try {
            osc.stop();
          } catch {
            // Ignore
          }
        }
      });
    });
  }

  // =========================================================================
  // 2. GAME OF THRONES: MAIN TITLE (Cello Ostinato, War Drums, Epic Minor)
  // =========================================================================
  private startGameOfThronesLoop() {
    if (!this.ctx || !this.fadeGain) return;

    // BPM: 84 in 4/4 (beat = 0.714s)
    const beat = 0.714;
    const sixteenth = beat / 4;

    const playSequence = () => {
      if (!this.ctx || !this.isPlaying || this.currentTheme !== 'game-of-thrones') return;
      const now = this.ctx.currentTime + 0.05;

      // 1. Rhythmic Driving Strings Ostinato (da-da, da-da-da-da...)
      // 8 measures of driving C minor staccato strings
      const totalMeasures = 8;
      for (let m = 0; m < totalMeasures; m++) {
        const mStart = now + m * 4 * beat;

        // War drum on downbeat (beat 1 and 3)
        this.playWarDrum(mStart, 1.2);
        this.playWarDrum(mStart + 2 * beat, 0.9);

        // Sub bass pulse C2
        this.playSubBassNote(mStart, 2 * beat, 65.41);
        this.playSubBassNote(mStart + 2 * beat, 2 * beat, 65.41);

        // 16th note triplet-like driving cello ostinato:
        // C3, C3, Eb3, F3, G3, C3, Eb3, F3
        const ostinatoNotes = [130.81, 130.81, 155.56, 174.61, 196.00, 130.81, 155.56, 174.61];
        ostinatoNotes.forEach((f, idx) => {
          const t = mStart + idx * (sixteenth * 2);
          this.playStaccatoString(t, sixteenth * 1.6, f);
        });
      }

      // 2. Lead Solo Cello - Deep, sorrowful, heroic melody
      // Starting on measure 1, beat 1
      let t = now;
      const melody: [number, number][] = [
        [392.00, 1.0], // G4
        [261.63, 1.0], // C4
        [311.13, 0.5], // Eb4
        [349.23, 0.5], // F4
        [392.00, 1.0], // G4
        [261.63, 1.0], // C4
        [311.13, 0.5], // Eb4
        [349.23, 0.5], // F4
        [293.66, 2.2], // D4 (sustained mournful vibrato)
        [0, 0.3],      // breath
        [349.23, 1.0], // F4
        [233.08, 1.0], // Bb3
        [311.13, 0.5], // Eb4
        [293.66, 0.5], // D4
        [349.23, 1.0], // F4
        [233.08, 1.0], // Bb3
        [311.13, 0.5], // Eb4
        [293.66, 0.5], // D4
        [261.63, 2.6], // C4 (resolving power)
        [0, 0.4],      // breath
        // Dramatic Rise
        [392.00, 1.0], // G4
        [261.63, 1.0], // C4
        [311.13, 0.5], // Eb4
        [349.23, 0.5], // F4
        [392.00, 1.0], // G4
        [261.63, 1.0], // C4
        [311.13, 0.5], // Eb4
        [349.23, 0.5], // F4
        [293.66, 2.0], // D4
        [392.00, 1.5], // G4
        [415.30, 1.5], // Ab4
        [392.00, 3.0]  // G4
      ];

      melody.forEach(([freq, dur]) => {
        if (freq > 0) {
          this.playLeadCello(t, dur * beat, freq);
        }
        t += dur * beat;
      });
    };

    // 8 measures * 4 beats * 0.714s ≈ 22.8 seconds
    const totalCycleMs = 32 * beat * 1000;
    playSequence();
    this.loopIntervalId = window.setInterval(playSequence, totalCycleMs);
  }

  private playLeadCello(startTime: number, duration: number, freq: number) {
    if (!this.ctx || !this.fadeGain) return;

    // Rich dual-oscillator cello: Sawtooth + subtle Square through resonant formant filter
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm detune for rich ensemble string width
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 0.998, startTime);

    // Cello body formant resonance
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, startTime);
    filter.Q.setValueAtTime(3.2, startTime);

    // Vibrato LFO starts after initial bow stroke
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.2, startTime);
    vibratoGain.gain.setValueAtTime(0, startTime);
    vibratoGain.gain.linearRampToValueAtTime(3.8, startTime + 0.35); // Gentle vibrato onset
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);

    // Expressive Bowing Envelope
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.28, startTime + 0.08);
    gain.gain.setValueAtTime(0.26, startTime + duration - 0.12);
    gain.gain.linearRampToValueAtTime(0.0001, startTime + duration + 0.08);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.fadeGain);
    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    vibrato.start(startTime);
    osc1.start(startTime);
    osc2.start(startTime);

    const stopTime = startTime + duration + 0.15;
    vibrato.stop(stopTime);
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    this.activeVoices.push({
      stop: () => {
        try {
          vibrato.stop();
          osc1.stop();
          osc2.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  private playStaccatoString(startTime: number, duration: number, freq: number) {
    if (!this.ctx || !this.fadeGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    this.activeVoices.push({
      stop: () => {
        try {
          osc.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  private playWarDrum(startTime: number, intensity: number) {
    if (!this.ctx || !this.fadeGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Pitch drops rapidly like a huge war kettle drum / timpani
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.28);

    gain.gain.setValueAtTime(0.42 * intensity, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

    osc.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    osc.stop(startTime + 0.7);

    this.activeVoices.push({
      stop: () => {
        try {
          osc.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  private playSubBassNote(startTime: number, duration: number, freq: number) {
    if (!this.ctx || !this.fadeGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.1);
    gain.gain.setValueAtTime(0.16, startTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    this.activeVoices.push({
      stop: () => {
        try {
          osc.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  // =========================================================================
  // 3. STRANGER THINGS: MAIN THEME (1980s Analog Arpeggiator & Filter Sweeps)
  // =========================================================================
  private startStrangerThingsLoop() {
    if (!this.ctx || !this.fadeGain) return;

    // BPM: 84 (sixteenth note arpeggiator = 0.1785s)
    const sixteenth = 0.1785;
    const measureDuration = 8 * sixteenth; // 8 notes per pattern cycle = 1.428s

    // The iconic 8-note arpeggio (C3 - E3 - G3 - B3 - C4 - B3 - G3 - E3)
    const arpeggioNotes = [
      130.81, // C3
      164.81, // E3
      196.00, // G3
      246.94, // B3
      261.63, // C4
      246.94, // B3
      196.00, // G3
      164.81  // E3
    ];

    const playSequence = () => {
      if (!this.ctx || !this.isPlaying || this.currentTheme !== 'stranger-things') return;
      const now = this.ctx.currentTime + 0.05;

      // 8 repetitions of the 8-note arpeggio (= 64 notes ≈ 11.4 seconds)
      const totalMeasures = 8;

      for (let m = 0; m < totalMeasures; m++) {
        const mStart = now + m * measureDuration;

        // Vintage synth filter sweep over time
        // Base cutoff breathes between 1100Hz and 2600Hz
        const sweepFactor = Math.sin((m / totalMeasures) * Math.PI);
        const baseCutoff = 1100 + sweepFactor * 1400;

        // Sub bass drone and analog kick heartbeat on beat 1 and 5
        this.playAnalogKick(mStart);
        this.playAnalogKick(mStart + 4 * sixteenth);
        this.playStrangerThingsDrone(mStart, measureDuration, 65.41); // C2 low drone

        // Schedule the 8 notes of the arpeggio
        arpeggioNotes.forEach((f, idx) => {
          const t = mStart + idx * sixteenth;
          this.playAnalogSynthPluck(t, sixteenth * 1.5, f, baseCutoff);
        });
      }
    };

    const totalCycleMs = 8 * measureDuration * 1000;
    playSequence();
    this.loopIntervalId = window.setInterval(playSequence, totalCycleMs);
  }

  private playAnalogSynthPluck(startTime: number, duration: number, freq: number, cutoff: number) {
    if (!this.ctx || !this.fadeGain) return;

    // Authentic dual detuned sawtooth synth (Roland Juno-106 emulation)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm detune (+5 cents) for thick vintage analog presence
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 1.004, startTime);

    // Resonant 24dB low-pass ladder filter
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(4.2, startTime);

    // Fast filter envelope snap: opens up and decays
    filter.frequency.setValueAtTime(cutoff + 1200, startTime);
    filter.frequency.exponentialRampToValueAtTime(cutoff * 0.7, startTime + 0.14);

    // Pluck Amp Envelope
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.24, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.04, startTime + 0.12);
    gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.fadeGain);
    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc1.start(startTime);
    osc2.start(startTime);

    const stopTime = startTime + duration + 0.05;
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    this.activeVoices.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  private playStrangerThingsDrone(startTime: number, duration: number, freq: number) {
    if (!this.ctx || !this.fadeGain) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    // Sub octave (C1 - 32.7 Hz)
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.2);
    gain.gain.setValueAtTime(0.18, startTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    subOsc.start(startTime);

    const stopTime = startTime + duration + 0.1;
    osc.stop(stopTime);
    subOsc.stop(stopTime);

    this.activeVoices.push({
      stop: () => {
        try {
          osc.stop();
          subOsc.stop();
        } catch {
          // Ignore
        }
      }
    });
  }

  private playAnalogKick(startTime: number) {
    if (!this.ctx || !this.fadeGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // 80s drum machine heartbeat kick: 90Hz drops to 36Hz
    osc.frequency.setValueAtTime(95, startTime);
    osc.frequency.exponentialRampToValueAtTime(36, startTime + 0.18);

    gain.gain.setValueAtTime(0.32, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);

    osc.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    osc.stop(startTime + 0.35);

    this.activeVoices.push({
      stop: () => {
        try {
          osc.stop();
        } catch {
          // Ignore
        }
      }
    });
  }
}

// Global Singleton instance for persistent sound control across page navigation
export const soundtrackEngine = new SoundtrackEngine();
