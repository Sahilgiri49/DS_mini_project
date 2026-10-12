// Web Audio API Sound Engine for Sorting Visualizer and Error Effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // Frequency mapped from value (range e.g. 5 to 500 mapped to 160Hz - 900Hz)
  public playComparisonTone(val: number, minVal = 5, maxVal = 100, duration = 0.04) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const norm = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
      const freq = 180 + norm * 720; // 180Hz - 900Hz

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might fail silently in restricted environments
    }
  }

  public playSwapTone(valA: number, valB: number, minVal = 5, maxVal = 100, duration = 0.06) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const avg = (valA + valB) / 2;
      const norm = Math.max(0, Math.min(1, (avg - minVal) / (maxVal - minVal || 1)));
      const freq = 220 + norm * 600;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.15, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(this.volume * 0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  // Dissonant, punchy warning buzzer sound effect for unexpected choice or error
  public playErrorSound() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.28;

      // Dual detuned sawtooth oscillators to create sharp, jarring dissonance
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      // Pitch drop from 180Hz down to 95Hz (classic reject / illegal action sound)
      osc1.frequency.setValueAtTime(175, now);
      osc1.frequency.exponentialRampToValueAtTime(85, now + duration);

      // Detuned by 18 Hz to create harsh audible beating
      osc2.frequency.setValueAtTime(193, now);
      osc2.frequency.exponentialRampToValueAtTime(97, now + duration);

      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.setValueAtTime(this.volume * 0.45, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio fallback
    }
  }

  // Harmonious celebration arpeggio when array sorting completes
  public playVictoryChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      const noteDuration = 0.08;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = this.ctx.currentTime + idx * noteDuration;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(this.volume * 0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundEngine();
