import { signal } from '@preact/signals';
import { Release, Place } from '../types';
import { getMediaUrl } from '../utils/media';

// Global Player State Signals
export const activeTrack = signal<Release | null>(null);
export const isPlaying = signal<boolean>(false);
export const isDrawerOpen = signal<boolean>(false);
export const isVideoLoaded = signal<boolean>(false);
export const currentPlaceAmbient = signal<Place | null>(null);
export const currentTrackList = signal<Release[]>([]);

// Audio Playback Progress Signals
export const currentTime = signal<number>(0);
export const totalDuration = signal<number>(0);
export const progressPercent = signal<number>(0);
export const formattedCurrentTime = signal<string>('00:00');
export const formattedTotalDuration = signal<string>('00:00');

// Native HTML5 Audio Element for Direct MP3s
let htmlAudio: HTMLAudioElement | null = null;

export function formatSeconds(sec: number): string {
  if (isNaN(sec) || sec <= 0) return '00:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function parseDurationToSeconds(durStr?: string | null): number {
  if (!durStr) return 0;
  const parts = durStr.split(':').map(p => parseInt(p.trim(), 10));
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  return 0;
}

export function sendYouTubeCommand(func: string, args: any[] = []): void {
  if (typeof document === 'undefined') return;
  const iframe = document.getElementById('freiberger-youtube-iframe') as HTMLIFrameElement | null;
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: func,
        args: args
      }),
      'https://www.youtube-nocookie.com'
    );
  }
}

if (typeof window !== 'undefined') {
  // 1. Native HTML5 Audio Listener
  htmlAudio = new Audio();
  htmlAudio.preload = 'metadata';

  htmlAudio.addEventListener('timeupdate', () => {
    if (!htmlAudio) return;
    const cur = htmlAudio.currentTime;
    const dur = htmlAudio.duration || 0;
    currentTime.value = cur;
    formattedCurrentTime.value = formatSeconds(cur);

    if (dur > 0) {
      totalDuration.value = dur;
      progressPercent.value = (cur / dur) * 100;
      formattedTotalDuration.value = formatSeconds(dur);
    }
  });

  htmlAudio.addEventListener('ended', () => {
    playNextTrack();
  });

  htmlAudio.addEventListener('play', () => {
    isPlaying.value = true;
  });

  htmlAudio.addEventListener('pause', () => {
    isPlaying.value = false;
  });

  // 2. YouTube IFrame API PostMessage Listener
  const allowedYouTubeOrigins = ['https://www.youtube-nocookie.com', 'https://www.youtube.com'];
  window.addEventListener('message', (event) => {
    if (!allowedYouTubeOrigins.includes(event.origin)) {
      return;
    }
    let data = event.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return;
      }
    }

    if (!data || typeof data !== 'object') return;

    // Handle infoDelivery events from YouTube
    if (data.event === 'infoDelivery' && data.info) {
      const info = data.info;

      // Update total duration if available
      if (typeof info.duration === 'number' && info.duration > 0) {
        totalDuration.value = info.duration;
        formattedTotalDuration.value = formatSeconds(info.duration);
      }

      // Update current playback time and progress
      if (typeof info.currentTime === 'number') {
        currentTime.value = info.currentTime;
        formattedCurrentTime.value = formatSeconds(info.currentTime);
        const dur = totalDuration.value > 0 ? totalDuration.value : (typeof info.duration === 'number' ? info.duration : 0);
        if (dur > 0) {
          progressPercent.value = Math.min(100, (info.currentTime / dur) * 100);
        }
      }

      // Handle YouTube player state changes
      if (typeof info.playerState === 'number') {
        if (info.playerState === 1) {
          // Playing
          isPlaying.value = true;
        } else if (info.playerState === 2) {
          // Paused
          isPlaying.value = false;
        } else if (info.playerState === 0) {
          // Ended -> Advance to next track
          isPlaying.value = false;
          playNextTrack();
        }
      }
    } else if (data.event === 'onStateChange' && typeof data.info === 'number') {
      if (data.info === 1) {
        isPlaying.value = true;
      } else if (data.info === 2) {
        isPlaying.value = false;
      } else if (data.info === 0) {
        isPlaying.value = false;
        playNextTrack();
      }
    }
  });

  // 3. Periodic ping to ensure YouTube stream progress updates are polled
  setInterval(() => {
    if (isPlaying.value && isVideoLoaded.value) {
      const iframe = document.getElementById('freiberger-youtube-iframe') as HTMLIFrameElement | null;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), 'https://www.youtube-nocookie.com');
      }
    }
  }, 1000);
}

export function initDefaultTrack(track: Release): void {
  if (!activeTrack.value) {
    activeTrack.value = track;
    if (track.duration) {
      const parsed = parseDurationToSeconds(track.duration);
      if (parsed > 0) totalDuration.value = parsed;
      formattedTotalDuration.value = track.duration;
    }
  }
}

export function setTrackList(list: Release[]): void {
  currentTrackList.value = list;
  if (!activeTrack.value && list.length > 0) {
    const defaultTrack = list.find(r => r.featured === 1) || list[0];
    initDefaultTrack(defaultTrack);
  }
}

export function playTrack(track: Release, autoOpenDrawer: boolean = false): void {
  const isDifferent = activeTrack.value?.id !== track.id;
  const wasVideoActive = isVideoLoaded.value;
  activeTrack.value = track;
  isPlaying.value = true;

  if (isDifferent) {
    currentTime.value = 0;
    progressPercent.value = 0;
    formattedCurrentTime.value = '00:00';
    if (track.duration) {
      const parsed = parseDurationToSeconds(track.duration);
      if (parsed > 0) totalDuration.value = parsed;
      formattedTotalDuration.value = track.duration;
    }
    // If video was already active or caller requested autoOpenDrawer, keep stream alive
    if (wasVideoActive || autoOpenDrawer) {
      isVideoLoaded.value = true;
    } else {
      isVideoLoaded.value = false;
    }
  } else {
    // Re-triggering the same track
    if (wasVideoActive) {
      sendYouTubeCommand('playVideo');
    }
  }

  // Handle HTML5 Native Audio if MP3 source is provided
  if (htmlAudio) {
    if (track.audio_url) {
      const audioSrc = getMediaUrl(track.audio_url);
      if (htmlAudio.src !== audioSrc) {
        htmlAudio.src = audioSrc;
        htmlAudio.load();
      }
      htmlAudio.play().catch(err => {
        console.warn('HTML5 audio play blocked:', err);
      });
    } else {
      // Pause HTML5 audio when playing via YouTube facade
      htmlAudio.pause();
    }
  }

  if (autoOpenDrawer) {
    isDrawerOpen.value = true;
  }
}

export function togglePlay(): void {
  if (!activeTrack.value) {
    if (currentTrackList.value.length > 0) {
      const defaultTrack = currentTrackList.value.find(t => t.featured === 1) || currentTrackList.value[0];
      playTrack(defaultTrack, true);
    }
    return;
  }

  // HTML5 audio mode
  if (htmlAudio && activeTrack.value.audio_url) {
    if (htmlAudio.paused) {
      htmlAudio.play().catch(() => {});
      isPlaying.value = true;
    } else {
      htmlAudio.pause();
      isPlaying.value = false;
    }
    return;
  }

  // YouTube audio/video mode
  if (!isVideoLoaded.value) {
    // Video not loaded yet: user clicked play, so load video and open drawer
    isVideoLoaded.value = true;
    isDrawerOpen.value = true;
    isPlaying.value = true;
  } else {
    // Video is already loaded: send postMessage to pause or play
    if (isPlaying.value) {
      sendYouTubeCommand('pauseVideo');
      isPlaying.value = false;
    } else {
      sendYouTubeCommand('playVideo');
      isPlaying.value = true;
    }
  }
}

export function playNextTrack(): void {
  const list = currentTrackList.value;
  if (!list.length || !activeTrack.value) return;

  const currentIndex = list.findIndex(r => r.id === activeTrack.value?.id);
  const nextTrack = (currentIndex === -1 || currentIndex >= list.length - 1)
    ? list[0]
    : list[currentIndex + 1];

  playTrack(nextTrack, isDrawerOpen.value);
}

export function playPrevTrack(): void {
  const list = currentTrackList.value;
  if (!list.length || !activeTrack.value) return;

  const currentIndex = list.findIndex(r => r.id === activeTrack.value?.id);
  const prevTrack = (currentIndex <= 0)
    ? list[list.length - 1]
    : list[currentIndex - 1];

  playTrack(prevTrack, isDrawerOpen.value);
}

export function seekTo(percent: number): void {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  progressPercent.value = clampedPercent;
  const targetSeconds = (clampedPercent / 100) * (totalDuration.value || 0);
  currentTime.value = targetSeconds;
  formattedCurrentTime.value = formatSeconds(targetSeconds);

  if (htmlAudio && activeTrack.value?.audio_url && htmlAudio.duration) {
    htmlAudio.currentTime = (clampedPercent / 100) * htmlAudio.duration;
  } else {
    sendYouTubeCommand('seekTo', [targetSeconds, true]);
  }
}

export function openDrawer(): void {
  isDrawerOpen.value = true;
}

export function closeDrawer(): void {
  isDrawerOpen.value = false;
}

export function toggleDrawer(): void {
  isDrawerOpen.value = !isDrawerOpen.value;
}

export function activateYouTubeEmbed(): void {
  isVideoLoaded.value = true;
  isPlaying.value = true;
}

export function setAmbientPlace(place: Place | null): void {
  currentPlaceAmbient.value = place;
}
