import {loadPages} from '../data/pages';
import {ContentPage} from './ContentPage';
import {ContentBlocks} from '../components/ContentBlocks';
import type {CmsPageContent} from '../types';
import { useEffect, useState } from 'preact/hooks';
import type { Book, Release } from '../types';
import { fetchReleases, getApiBase } from '../api/client';
import { BookPage } from './BookPage';
import { BookEditionPage } from './BookEditionPage';
import { PlaylistBookPage } from './PlaylistBookPage';
import { ReleaseSlider } from '../components/ReleaseSlider';
import { HeaderNav } from '../components/HeaderNav';
import { Footer } from '../components/Footer';
import { PlayerBar } from '../components/PlayerBar';
import { PlayerDrawer } from '../components/PlayerDrawer';
import { AmbientStage } from '../components/AmbientStage';
import { setTrackList } from '../player/playerStore';
import { loadBooks } from '../data/books';
import { setLanguage } from '../i18n';
import { getMediaUrl } from '../utils/media';

type PreviewItem = Record<string, string | number | null>;
export function CmsPreviewPage() {
  const [item, setItem] = useState<PreviewItem | null>(null);
  const [tracks, setTracks] = useState<Release[]>([]);
  const [error, setError] = useState('');
  const area = new URLSearchParams(location.search).get('area') || '';
  const draftMode = new URLSearchParams(location.search).get('mode') === 'draft';
  const id = new URLSearchParams(location.search).get('id') || '';
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    Promise.all([
      draftMode ? Promise.resolve({item:null}) : fetch(`${getApiBase()}/cms/preview/${encodeURIComponent(area)}/${encodeURIComponent(id)}`, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
        .then(async response => {
          if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Bitte im CMS anmelden und die Vorschau aktualisieren.' : 'Vorschau nicht verfügbar.');
          return response.json();
        }),
      fetchReleases(undefined, { signal: controller.signal, throwOnError: true }),
    ]).then(([data, releases]) => { if(data.item) {setLanguage(data.item.language || 'de'); setItem(data.item);} setTracks(releases); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); else setError('Vorschau konnte nicht geladen werden. Bitte aktualisieren.'); })
      .finally(() => clearTimeout(timeout));
    void loadBooks(); void loadPages();
    const receive = (event: MessageEvent) => {
      if (!draftMode || event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'music-cms-preview' || event.data.area !== area || !event.data.item) return;
      setLanguage(event.data.item.language || 'de');setItem(event.data.item);setError('');
    };
    window.addEventListener('message',receive);
    if(draftMode)window.parent.postMessage({type:'music-cms-preview-ready'},location.origin);
    return () => { clearTimeout(timeout);controller.abort();window.removeEventListener('message',receive); };
  }, [area, id, draftMode]);

  useEffect(() => {
    if (!item || area === 'books') return;
    const related = tracks.filter(track => area === 'releases' ? track.id === item.id : area === 'series' ? track.series_id === item.id : area === 'places' ? track.place_id === item.id : track.chapter_id === item.id);
    setTrackList(area === 'releases' ? [{ ...related[0], ...item } as unknown as Release] : related);
  }, [item, tracks, area]);

  if (error || !item) return <main class="hero-stage" role="status"><p>{error || 'Vorschau wird geladen …'}</p></main>;
  const book = item as unknown as Book;
  let content;
  if(area === 'pages') content=<ContentPage page={item as unknown as CmsPageContent}/>;
  else if (area === 'books') content = book.songs_playlist_url && book.soundtrack_series_id == null ? <PlaylistBookPage book={book} />
    : book.language === 'de' ? <BookPage book={book} /> : <BookEditionPage book={book} edition={book.language} />;
  else {
    const related = tracks.filter(track => area === 'releases' ? track.id === item.id : area === 'series' ? track.series_id === item.id : area === 'places' ? track.place_id === item.id : track.chapter_id === item.id);
    // The saved release is the source of truth, including records not yet in the public catalog.
    const releases = area === 'releases' ? [{ ...related[0], ...item } as unknown as Release] : related;
    content = <div class="hero-stage" style={{ paddingBottom: '90px' }}><ContentBlocks value={item.content_blocks}>
      <div class="hero-super">{item.genre || item.greek_name || (area === 'chapters' ? `Kapitel ${item.chapter_number}` : '')}</div>
      <h1 class="hero-headline">{item.title || item.name}</h1>
      <div class="hero-subline">{item.subtitle || item.tagline}</div>
      {area === 'places' && item.image && <img src={getMediaUrl(String(item.image))} alt="" style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain' }} />}
      {(item.description || item.excerpt) && <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{item.description || item.excerpt}</p>}
      {releases.length > 0 && <ReleaseSlider title={area === 'chapters' ? 'Hörbuchkapitel' : 'Musik & Hörbücher'} releases={releases} />}
      {item.story && <p style={{ whiteSpace: 'pre-wrap' }}>{item.story}</p>}
      {item.lyrics && <p style={{ whiteSpace: 'pre-wrap' }}>{item.lyrics}</p>}
    </ContentBlocks></div>;
  }
  return <div class="app-container"><AmbientStage /><HeaderNav /><main class="main-content">{content}</main><Footer /><PlayerBar /><PlayerDrawer /></div>;
}
