import { signal } from '@preact/signals';
import { fetchBooks } from '../api/client';
import type { Book, Release } from '../types';
import { englishBookSoundtrack } from './englishBookSoundtrack';

export const books = signal<Book[] | null>(null);
export const booksError = signal(false);
let pending: Promise<void> | undefined;

export function loadBooks(): Promise<void> {
  if (!pending) pending = fetchBooks().then(data => { books.value = data; booksError.value = false; })
    .catch(() => { booksError.value = true; }).finally(() => { pending = undefined; });
  return pending;
}

export function bookMenu(items: Book[]): Book[] {
  return items.filter(book => book.is_published === 1 && book.show_in_navigation === 1)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}

export function findBook(items: Book[], path: string): Book | undefined {
  const slug = path.replace(/^\//, '');
  return items.find(book => book.is_published === 1 && (book.slug === slug
    || (slug === 'die-orte-die-mich-sahen' && book.slug === 'die-orte-die-uns-sahen')));
}

export function bookMedia(book: Book, releases: Release[]): { songs: Release[]; audiobooks: Release[] } {
  return {
    songs: book.soundtrack_source === 'english_book' ? englishBookSoundtrack
      : book.soundtrack_series_id == null ? [] : releases.filter(track => track.series_id === book.soundtrack_series_id && ['song','single'].includes(track.type)),
    audiobooks: book.audiobook_series_id == null ? [] : releases.filter(track => track.series_id === book.audiobook_series_id && ['audiobook','chapter_audio'].includes(track.type))
      .sort((a, b) => (a.chapter_number ?? a.sort_order ?? 0) - (b.chapter_number ?? b.sort_order ?? 0)),
  };
}

// Labels describe the verified recording language, independently of the book edition.
export function redScarfMediaCopy(book: Book, language: 'de' | 'en' | 'fr') {
  if (!book.songs_playlist_url?.includes('list=PLZZxqjAKPSZo')) return null;
  return {
    de: { songs: 'Songs auf Französisch', audiobook: 'Hörbuch auf Deutsch', intro: 'Hier findest du die französischen Songs und die bisher veröffentlichten deutschen Hörbuchkapitel.' },
    en: { songs: 'Songs in French', audiobook: 'Audiobook in German', intro: 'Listen to the French songs and the German audiobook chapters published so far.' },
    fr: { songs: 'Chansons en français', audiobook: 'Livre audio en allemand', intro: 'Écoutez les chansons en français et les chapitres du livre audio en allemand publiés à ce jour.' },
  }[language];
}
