import type { Release } from '../types';

// Older Studio versions changed edited songs to singles; their series association survives.
export function isBookSoundtrack(release: Release): boolean {
  return release.type === 'song'
    || (release.type === 'single' && release.series_slug === 'the-greece-chapters');
}
