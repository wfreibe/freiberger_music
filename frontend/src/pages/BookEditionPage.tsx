import { BookLinks } from '../components/BookLinks';
import { useEffect, useState } from 'preact/hooks';
import { activeTrack, isPlaying, playTrack, setTrackList } from '../player/playerStore';
import { englishBookPlaylistUrl } from '../data/englishBookSoundtrack';
import type { Book, Release } from '../types';
import { fetchReleases } from '../api/client';
import { getMediaUrl } from '../utils/media';
import { currentLang } from '../i18n';
import { getBookEditionCopy } from '../i18n/bookEdition';
import { bookMedia, redScarfMediaCopy } from '../data/books';

export function BookEditionPage({ edition, book }: { edition: 'en' | 'fr'; book: Book }) {
  const french = edition === 'fr';
  const [songs, setSongs] = useState<Release[]>(bookMedia(book, []).songs);
  const [audiobooks, setAudiobooks] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchReleases().then(tracks => {
      if (cancelled) return;
      const media = bookMedia(book, tracks);
      setSongs(media.songs);
      setAudiobooks(media.audiobooks);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [book.soundtrack_source, book.soundtrack_series_id, book.audiobook_series_id, reloadKey]);
  const language = currentLang.value;
  const mediaCopy = redScarfMediaCopy(book, language);
  const copy = getBookEditionCopy(edition, language);
  const [activeTab, setActiveTab] = useState<'songs' | 'audiobook'>('songs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const tracks = activeTab === 'audiobook' ? audiobooks : songs;
  const sectionTitle = activeTab === 'audiobook' ? copy.audiobook : copy.soundtrack;
  const handlePlay = (track: Release) => {
    setTrackList(tracks);
    playTrack(track, true);
  };

  return (
    <div class="hero-stage" lang={language} style={{ paddingBottom: '90px' }}>
      <div class="hero-super">{copy.super}</div>
      <h1 class="hero-headline" lang={edition} style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', maxWidth: '1100px' }}>
        {book.title.toLocaleUpperCase(book.language)}
      </h1>
      {book.subtitle && <div class="english-book-author">{book.subtitle}</div>}
      <div class="english-book-author">{book.author}</div>
      <div class="book-formats-badges" style={{ marginBottom: '32px' }}>
        {book.formats ? book.formats.split('·').map(format => <span key={format} class="book-format-chip">{format.trim()}</span>) : <>
          <span class="book-format-chip">{copy.book}</span>
          <span class="book-format-chip">{copy.ebook}</span>
          <span class="book-format-chip">{copy.soundtrack}</span>
        </>}
      </div>
      <div class="english-book-intro">
        <p>{copy.welcome} <em lang={edition}>{book.title}</em>.</p>
        <p>{book.description ?? mediaCopy?.intro ?? copy.intro}</p>
      </div>

      <BookLinks book={book} />
      <div class="editorial-tab-group">
        <button type="button" class={`editorial-tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
          aria-pressed={activeTab === 'songs'} onClick={() => setActiveTab('songs')}>
          <span class="tab-title-main">{copy.soundtrack}</span>
          <span class="editorial-tab-badge">{songs.length} {copy.songs} · {mediaCopy?.songs ?? copy.subtitle}</span>
        </button>
        <button type="button" class={`editorial-tab-btn ${activeTab === 'audiobook' ? 'active' : ''}`}
          aria-pressed={activeTab === 'audiobook'} onClick={() => {
            setActiveTab('audiobook');
          }}>
          <span class="tab-title-main">{mediaCopy?.audiobook ?? copy.audiobook}</span>
          <span class="editorial-tab-badge">{french || book.audiobook_series_id != null ? `${audiobooks.length} ${copy.chapters}` : 'Coming soon'}</span>
        </button>
      </div>

      {activeTab === 'songs' || french || book.audiobook_series_id != null ? (
        <section aria-label={sectionTitle} class="english-book-soundtrack">
          <div class="english-soundtrack-toolbar">
            <span>{sectionTitle} · {tracks.length} {activeTab === 'audiobook' ? copy.chapters : copy.songs}</span>
            <div class="english-view-switch" aria-label={sectionTitle}>
              <button type="button" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}>{copy.cards}</button>
              <button type="button" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>{copy.list}</button>
            </div>
          </div>
          {loading && <p role="status">{copy.loading}</p>}
          {!loading && tracks.length === 0 && <div role="alert">
            <p>{copy.unavailable}</p>
            <button type="button" class="btn-editorial btn-editorial-ghost" onClick={() => setReloadKey(value => value + 1)}>{copy.retry}</button>
          </div>}
          <div class={viewMode === 'grid' ? 'release-grid' : 'english-track-list'}>
            {tracks.map((track, index) => {
              const playing = activeTrack.value?.id === track.id && isPlaying.value;
              return <button key={track.id} type="button"
                class={`english-track ${viewMode === 'grid' ? 'english-track-card' : 'english-track-row'} ${playing ? 'is-playing' : ''}`}
                aria-label={`${copy.play} ${track.title}`} onClick={() => handlePlay(track)}>
                {viewMode === 'grid' ? (
                  <span class="card-cover-box english-track-cover">
                    <img src={getMediaUrl(track.cover)} alt="" class="card-cover" loading="lazy" />
                    <span class="card-track-number">{String(index + 1).padStart(2, '0')}</span>
                    <span class="card-play-hover"><span class="play-circle-btn" aria-hidden="true">▶</span></span>
                  </span>
                ) : (
                  <>
                    <span class="english-track-number">{String(index + 1).padStart(2, '0')}</span>
                    <img src={getMediaUrl(track.cover)} alt="" class="chapter-thumb" loading="lazy" />
                  </>
                )}
                <span class="english-track-title">{track.title}</span>
                <span class="english-track-duration">{track.duration}</span>
                <span class="english-track-play">{playing ? `♫ ${copy.playing}` : `▶ ${copy.play}`}</span>
              </button>;
            })}
          </div>
          {book.soundtrack_source === 'english_book' && <a class="btn-editorial btn-editorial-ghost" href={englishBookPlaylistUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: '24px' }}>
            {copy.playlist}
          </a>}
        </section>
      ) : (
        <section class="english-book-coming-soon" aria-label={copy.audiobook}>
          <h2>Coming soon</h2>
          <p>{copy.audiobookNote}</p>
        </section>
      )}
    </div>
  );
}
