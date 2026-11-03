import { signal } from '@preact/signals';

// Ambient Sea & Wind Generator (Procedural Web Audio API)
// Generates authentic Aegean waves & coastal breeze with zero network overhead

export const isAmbientPlaying = signal<boolean>(false);
export const ambientVolume = signal<number>(0.4);

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let waveSource: AudioBufferSourceNode | null = null;
let windSource: AudioBufferSourceNode | null = null;
let lfoOsc: OscillatorNode | null = null;

function createNoiseBuffer(ctx: AudioContext, seconds: number = 5): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian / Pink noise integration for deep ocean roar
      lastOut = (lastOut + 0.025 * white) / 1.025;
      data[i] = lastOut * 3.5;
    }
  }
  return buffer;
}

function initAudioGraph(): boolean {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;

    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const noiseBuffer = createNoiseBuffer(audioCtx, 6);

    // 1. WAVE SWELL NODE (Low-pass filtered brownian noise modulated by wave swell LFO)
    waveSource = audioCtx.createBufferSource();
    waveSource.buffer = noiseBuffer;
    waveSource.loop = true;

    const waveFilter = audioCtx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(320, audioCtx.currentTime);
    waveFilter.Q.setValueAtTime(2.0, audioCtx.currentTime);

    // LFO for periodic wave incoming and receding (approx 8.5 seconds per wave)
    lfoOsc = audioCtx.createOscillator();
    lfoOsc.type = 'sine';
    lfoOsc.frequency.setValueAtTime(0.12, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(220, audioCtx.currentTime); // mod range

    lfoOsc.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);

    const waveGain = audioCtx.createGain();
    waveGain.gain.setValueAtTime(0.65, audioCtx.currentTime);

    waveSource.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(masterGain);

    // 2. WIND / COASTAL AIR NODE (Subtle high-pass / band-pass airy texture)
    windSource = audioCtx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = audioCtx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(650, audioCtx.currentTime);
    windFilter.Q.setValueAtTime(0.8, audioCtx.currentTime);

    const windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);

    waveSource.start();
    windSource.start();
    lfoOsc.start();

    return true;
  } catch (err) {
    console.warn('Web Audio ambient initialization failed:', err);
    return false;
  }
}

export function startAmbientSound(): void {
  if (!audioCtx) {
    const success = initAudioGraph();
    if (!success) return;
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (masterGain && audioCtx) {
    // Gentle 1.5s fade-in
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(ambientVolume.value, audioCtx.currentTime + 1.5);
    isAmbientPlaying.value = true;
  }
}

export function stopAmbientSound(): void {
  if (masterGain && audioCtx) {
    // Gentle 1.2s fade-out
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    setTimeout(() => {
      isAmbientPlaying.value = false;
    }, 1200);
  } else {
    isAmbientPlaying.value = false;
  }
}

export function toggleAmbientSound(): void {
  if (isAmbientPlaying.value) {
    stopAmbientSound();
  } else {
    startAmbientSound();
  }
}

export function setAmbientVolume(vol: number): void {
  ambientVolume.value = Math.max(0, Math.min(1, vol));
  if (isAmbientPlaying.value && masterGain && audioCtx) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(ambientVolume.value, audioCtx.currentTime + 0.1);
  }
}
