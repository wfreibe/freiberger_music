import type { Release } from '../types';

export const englishBookPlaylistId = 'PLVWqVtOXwCCE';
export const englishBookPlaylistUrl = `https://www.youtube.com/playlist?list=${englishBookPlaylistId}`;

// Public playlist order, video IDs and durations verified on 2026-10-02.
// Negative IDs keep these edition-specific tracks separate from database releases.
const videos = [
  ['cE5vYHKfJiw', 'Rising From The Depths', '06:25'],
  ['-HeQFOKihCY', 'A Moment To Breathe', '06:00'],
  ['qrPJagLqe08', 'The Portara Mirror', '06:38'],
  ['v6cdKzF6pgg', 'The Hippocrates Pulse', '06:40'],
  ['wBGYN4zKYCw', 'Where The Ash Breathes', '06:24'],
  ['261BhiPN1zM', 'Between Wine And Stone', '07:09'],
  ['rDX0Ik1UWhM', 'What The Sea Remembered', '06:33'],
  ['tFazUWDgf4E', 'Out Of The Dark', '07:17'],
  ['9pJU6q6owjE', 'The Journey Remains', '06:51'],
  ['hPel8Xswa74', 'Ionian Embrace', '07:17'],
] as const;

export const englishBookSoundtrack: Release[] = videos.map(([youtubeId, title, duration], index) => ({
  id: -1001 - index,
  slug: `the-places-that-saw-us-${youtubeId}`,
  title,
  type: 'song',
  youtube_id: youtubeId,
  cover: `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
  youtube_playlist_id: englishBookPlaylistId,
  duration,
  sort_order: index + 1,
}));
