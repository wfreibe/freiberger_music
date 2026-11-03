import type { Release } from '../types';

export const audiobookSeries = {
  de: 'hoerbuch-die-orte-die-uns-sahen',
  fr: 'livre-audio-les-lieux-qui-nous-ont-vus',
} as const;

export function getBookAudiobooks(releases: Release[], edition: keyof typeof audiobookSeries): Release[] {
  return releases.filter(track => (track.type === 'audiobook' || track.type === 'chapter_audio')
    && track.series_slug === audiobookSeries[edition])
    .sort((a, b) => (a.chapter_number ?? a.sort_order ?? 0) - (b.chapter_number ?? b.sort_order ?? 0));
}
