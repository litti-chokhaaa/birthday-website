function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

class AudioManager {
  private bgAudio: HTMLAudioElement | null = null;
  private ytIframe: HTMLIFrameElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private synthTimer: number | null = null;
  private currentUrl: string = '';

  constructor() {
    // Lazy init
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  public setMusic(url: string) {
    this.currentUrl = url;
    const ytId = extractYouTubeId(url);

    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio = null;
    }

    if (ytId) {
      this.setupYouTubeIframe(ytId);
    } else {
      this.removeYouTubeIframe();
      this.bgAudio = new Audio(url);
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.5;
    }
  }

  private setupYouTubeIframe(ytId: string) {
    let iframe = document.getElementById('bg-youtube-player') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'bg-youtube-player';
      iframe.style.position = 'fixed';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.allow = 'autoplay';
      document.body.appendChild(iframe);
    }
    iframe.src = `https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&loop=1&playlist=${ytId}&controls=0&mute=0`;
    this.ytIframe = iframe;
  }

  private removeYouTubeIframe() {
    const iframe = document.getElementById('bg-youtube-player');
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
    this.ytIframe = null;
  }

  private sendYTCommand(command: 'playVideo' | 'pauseVideo') {
    if (this.ytIframe && this.ytIframe.contentWindow) {
      try {
        this.ytIframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      } catch {
        // Ignore iframe postMessage errors
      }
    }
  }

  public playMusic() {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ytId = extractYouTubeId(this.currentUrl);

    if (ytId) {
      if (!this.ytIframe) {
        this.setupYouTubeIframe(ytId);
      } else {
        this.sendYTCommand('playVideo');
      }
      this.isPlaying = true;
    } else if (this.bgAudio) {
      this.bgAudio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(() => {
          this.startSynthMelody();
          this.isPlaying = true;
        });
    } else {
      this.startSynthMelody();
      this.isPlaying = true;
    }
  }

  public pauseMusic() {
    const ytId = extractYouTubeId(this.currentUrl);
    if (ytId) {
      this.sendYTCommand('pauseVideo');
    }
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.stopSynthMelody();
    this.isPlaying = false;
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.playMusic();
      return true;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlaying;
  }

  public playChime(type: 'unlock' | 'blow' | 'confetti' | 'unwrap' | 'heart') {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (type === 'unlock') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = this.audioCtx!.createOscillator();
          const gain = this.audioCtx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(this.audioCtx!.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.6);
        });
      } else if (type === 'blow') {
        const bufferSize = this.audioCtx.sampleRate * 0.8;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start(now);
      } else if (type === 'confetti' || type === 'unwrap') {
        [659.25, 783.99, 987.77, 1318.51, 1567.98].forEach((freq, idx) => {
          const osc = this.audioCtx!.createOscillator();
          const gain = this.audioCtx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.1, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);
          osc.connect(gain);
          gain.connect(this.audioCtx!.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.5);
        });
      } else if (type === 'heart') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // Ignore audio synthesis errors
    }
  }

  private startSynthMelody() {
    this.stopSynthMelody();
    this.initAudioContext();
    if (!this.audioCtx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 329.63];
    let noteIdx = 0;

    this.synthTimer = window.setInterval(() => {
      if (!this.audioCtx || !this.isPlaying) return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    }, 1200);
  }

  private stopSynthMelody() {
    if (this.synthTimer !== null) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }
}

export const audioManager = new AudioManager();