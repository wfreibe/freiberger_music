import type { Release } from '../types';
import { englishBookSoundtrack } from './englishBookSoundtrack';

export type MediaKind = 'music' | 'audiobook';
export type MediaLanguage = 'de' | 'en' | 'fr' | 'instrumental' | 'unknown';
export interface CatalogEntry {
  key: string;
  release: Release;
  kind: MediaKind;
  language: MediaLanguage;
}

// Verified German soundtrack videos; a translated book title does not change the audio language.
const germanSongs = new Set([
  'dvLEsXrZXJ8', 'd87nefPuDgU', '5WFzRxamMPs', '3-_lDTXqijw', 'ZSzFRGumV9Q',
  'YTb6bBPs7sc', '3iGRwql0ug8', 'pVy3cQxnpm0', 'gonZwH0MBlU', 'UbpEoFPuQEo',
]);
const englishSongs = new Set(englishBookSoundtrack.map(track => track.youtube_id));
const englishSongSlugs = new Set(['the-light-we-carry', 'until-the-dream', 'heart-on-the-court', 'head-turns-to-stone']);
// Language confirmed by the owner for these four GARD 7 videos.
for (const videoId of ['SWYXBXpnjNc', '7vgbX3OljBI', 'NiVTom43ReQ', 'qrtKV_jNzrE']) englishSongs.add(videoId);

export function buildMediaCatalog(releases: Release[]): CatalogEntry[] {
  const unique = new Map<string, CatalogEntry>();
  for (const release of [...releases, ...englishBookSoundtrack]) {
    const videoId = release.youtube_id?.trim();
    const audioUrl = release.audio_url?.trim();
    if (!videoId && !audioUrl) continue;
    const key = videoId ? `youtube:${videoId}` : `audio:${audioUrl}`;
    if (unique.has(key)) continue;
    const kind = release.type === 'audiobook' || release.type === 'chapter_audio' ? 'audiobook' : 'music';
    let language: MediaLanguage = 'unknown';
    if (['livre-audio-les-lieux-qui-nous-ont-vus', 'der-rote-schal-soundtrack'].includes(release.series_slug || '')) language = 'fr';
    else if (englishSongSlugs.has(release.slug) || (videoId && englishSongs.has(videoId))) language = 'en';
    else if ((videoId && germanSongs.has(videoId)) || ['the-greece-chapters', 'hoerbuch-die-orte-die-uns-sahen', 'hoerbuch-der-rote-schal'].includes(release.series_slug || '')) language = 'de';
    unique.set(key, { key, release, kind, language });
  }
  return [...unique.values()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'music' ? -1 : 1;
    if (a.kind === 'audiobook') {
      const series = (a.release.series_slug || '').localeCompare(b.release.series_slug || '');
      if (series) return series;
      return (a.release.chapter_number ?? a.release.sort_order ?? Number.MAX_SAFE_INTEGER)
        - (b.release.chapter_number ?? b.release.sort_order ?? Number.MAX_SAFE_INTEGER);
    }
    return 0;
  });
}

export function filterMediaCatalog(entries: CatalogEntry[], kind: MediaKind | 'all', language: MediaLanguage | 'all', query: string): CatalogEntry[] {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    if (kind !== 'all' && entry.kind !== kind) return false;
    if (language !== 'all' && entry.language !== language) return false;
    const text = normalize([entry.release.title, entry.release.subtitle, entry.release.place_name, entry.release.series_title].filter(Boolean).join(' '));
    return terms.every(term => text.includes(term));
  });
}
