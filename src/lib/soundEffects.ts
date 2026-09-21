// Audio chime synthesizers for e-Office DMS using standard Web Audio API
// No external asset loading required, responsive and lightweight.

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Check saved audio preference
    try {
      const saved = localStorage.getItem('eoffice_houaphanh_sound_enabled');
      this.isEnabled = saved !== null ? saved === 'true' : true;
    } catch {
      this.isEnabled = true;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    try {
      localStorage.setItem('eoffice_houaphanh_sound_enabled', enabled ? 'true' : 'false');
    } catch {}
  }

  public toggleSound(): boolean {
    const next = !this.isEnabled;
    this.setSoundEnabled(next);
    if (next) {
      this.playSuccessChime();
    }
    return next;
  }

  /**
   * Gentle pleasant success chime (C5 -> E5 -> G5)
   */
  public playSuccessChime() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Urgent Attention Alert chime (High alert double beep)
   */
  public playUrgentAlertChime() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const pulses = [880, 880]; // A5 double chime

      pulses.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.22);
      });
    } catch {}
  }

  /**
   * Subtle soft click / action tick
   */
  public playClickTick() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Grand ceremonial chime for E-Signature and stamp verification
   */
  public playSignatureCelebration() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.6);
      });
    } catch {}
  }
}

export const soundEffects = new SoundEffectsService();
