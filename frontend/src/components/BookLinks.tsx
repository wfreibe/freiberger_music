import type { Book } from '../types';
import { currentLang } from '../i18n';

export function BookLinks({ book }: { book: Book }) {
  const copy = {
    de: ['Bei epubli kaufen', 'Songs auf YouTube', 'Hörbuch auf Deutsch', 'Film auf YouTube'],
    en: ['Buy at epubli', 'Songs on YouTube', 'Audiobook in German', 'Film on YouTube'],
    fr: ['Acheter chez epubli', 'Chansons sur YouTube', 'Livre audio en allemand', 'Film sur YouTube'],
  }[currentLang.value];
  const urls = [book.purchase_url, book.songs_playlist_url, book.audiobook_playlist_url, book.film_url];
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
    {urls.map((url, index) => url && <a key={index} class="btn-editorial btn-editorial-ghost" href={url} target="_blank" rel="noopener noreferrer">{copy[index]}</a>)}
  </div>;
}
