import { BookLinks } from '../components/BookLinks';
import { useEffect, useState } from 'preact/hooks';
import { Book, Release } from '../types';
import { fetchReleases } from '../api/client';
import { activeTrack, isPlaying, playTrack, setTrackList } from '../player/playerStore';
import { currentLang, t, translatePlaceName, translateSubtitle } from '../i18n';
import { getBookDescription } from '../i18n/contentTranslations';
import { getMediaUrl } from '../utils/media';
import { bookMedia, redScarfMediaCopy } from '../data/books';

export function BookPage({ book }: { book: Book }) {
  const mediaCopy = redScarfMediaCopy(book, currentLang.value);
  const [songs, setSongs] = useState<Release[]>([]);
  const [audiobooks, setAudiobooks] = useState<Release[]>([]);
  const [activeTab, setActiveTab] = useState<'songs' | 'audiobooks'>('songs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      const allReleases = await fetchReleases();
      if (cancelled) return;
      const { songs: songList, audiobooks: abList } = bookMedia(book, allReleases);

      setSongs(songList);
      setAudiobooks(abList);
      setTrackList(songList);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [book.soundtrack_source, book.soundtrack_series_id, book.audiobook_series_id]);

  const handlePlay = (rel: Release) => {
    setTrackList(activeTab === 'songs' ? songs : audiobooks);
    playTrack(rel, true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {t('book_loading')}
        </span>
      </div>
    );
  }

  return (
    <div class="hero-stage" style={{ paddingBottom: '90px' }}>
      <div class="hero-super">
        {t('book_page_super')}
      </div>

      <h1 class="hero-headline" style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', maxWidth: '1100px' }}>
        {book.title.toLocaleUpperCase(book.language)}
      </h1>

      <div style={{ fontSize: '1.25rem', color: 'var(--accent-sand)', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {book.subtitle}
      </div>

      <div style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '32px' }}>
        {book.author}
      </div>

      <div class="book-formats-badges" style={{ marginBottom: '32px' }}>
        {book.formats?.split('·').map((f) => (
          <span key={f.trim()} class="book-format-chip">
            {f.trim()}
          </span>
        ))}
      </div>

      <div style={{ maxWidth: '820px', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '40px' }}>
        <p style={{ marginBottom: '14px' }}>{getBookDescription(book)}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {mediaCopy?.intro ?? t('book_welcome_hint')}
        </p>
      </div>

      {/* EDITORIAL TABS (Responsive Segmented Control) */}
      <BookLinks book={book} />
      <div class="editorial-tab-group">
        <button
          type="button"
          onClick={() => setActiveTab('songs')}
          class={`editorial-tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
        >
          <span class="tab-title-main">{t('book_tab_songs_main')}</span>
          <span class="editorial-tab-badge">{songs.length} {t('book_songs_badge')} · {mediaCopy?.songs ?? t('book_tab_songs_sub')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audiobooks')}
          class={`editorial-tab-btn ${activeTab === 'audiobooks' ? 'active' : ''}`}
        >
          <span class="tab-title-main">{t('book_tab_audiobook_main')}</span>
          <span class="editorial-tab-badge">{audiobooks.length} {t('book_audiobook_badge')} · {mediaCopy?.audiobook ?? t('book_tab_audiobook_sub')}</span>
        </button>
      </div>

      {/* TAB 1: SONGS */}
      {activeTab === 'songs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-sand)' }}>
              {t('book_songs_intro')} · {songs.length} {t('book_songs_badge')}
            </div>

            {/* View Mode Toggle: Cards vs List */}
            <div style={{ display: 'inline-flex', border: '1px solid var(--border-medium)', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'var(--text-primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 14px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('view_grid')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? 'var(--text-primary)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 14px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('view_list')} ({songs.length})
              </button>
            </div>
          </div>

          {/* Grid View (Cards) */}
          {viewMode === 'grid' && (
            <div class="release-grid">
              {songs.map((song, idx) => {
                const isCurrent = activeTrack.value?.id === song.id;
                const isCurrentPlaying = isCurrent && isPlaying.value;
                return (
                  <div
                    key={song.id}
                    class="release-card"
                    onClick={() => handlePlay(song)}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: isCurrent ? '1px solid var(--accent-sand)' : '1px solid var(--border-subtle)',
                      boxShadow: isCurrent ? '0 0 20px rgba(212,180,131,0.2)' : 'none'
                    }}
                  >
                    <div class="card-cover-box" style={{ marginBottom: '16px' }}>
                      <div class="card-track-number">{String(idx + 1).padStart(2, '0')}</div>
                      <img
                        src={getMediaUrl(song.cover) || '/covers/was-das-meer-bewahrte.svg'}
                        alt=""
                        class="card-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div class="card-play-hover" style={isCurrentPlaying ? { opacity: 1 } : {}}>
                        {isCurrentPlaying ? (
                          <div class="card-eq">
                            <span></span><span></span><span></span>
                          </div>
                        ) : (
                          <div class="play-circle-btn" title={t('play_label')}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginLeft: '2px' }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div class="card-meta-top">
                      <span>{translatePlaceName(song.place_name) || (mediaCopy ? '' : t('default_place'))}</span>
                      {song.bpm && <span style={{ color: 'var(--accent-sand)' }}>{song.bpm} BPM</span>}
                      {song.duration && <span>{song.duration}</span>}
                    </div>

                    <h3 class="card-title" style={{ fontSize: '17px', marginBottom: '6px' }}>
                      {song.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {translateSubtitle(song.subtitle)}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                        {song.genre}
                      </span>
                      <span style={{ fontSize: '11px', color: isCurrentPlaying ? '#fff' : 'var(--accent-sand)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: isCurrentPlaying ? 600 : 400 }}>
                        {isCurrentPlaying ? t('playing_label') : t('play_label')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View (Mobile-optimized responsive rows) */}
          {viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '1100px' }}>
              {songs.map((song, idx) => {
                const isCurrent = activeTrack.value?.id === song.id;
                const isCurrentPlaying = isCurrent && isPlaying.value;
                return (
                  <div
                    key={song.id}
                    class={`chapter-row ${isCurrent ? 'is-active' : ''}`}
                    onClick={() => handlePlay(song)}
                  >
                    <div class="chapter-num">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div class="chapter-info">
                      {song.cover && (
                        <img
                          src={getMediaUrl(song.cover)}
                          alt=""
                          class="chapter-thumb"
                        />
                      )}
                      <div class="chapter-text-block">
                        <h4>{song.title}</h4>
                        <p>
                          {translateSubtitle(song.subtitle)} {song.place_name && `· ${translatePlaceName(song.place_name)}`}
                          {song.bpm && <span style={{ color: 'var(--accent-sand)', marginLeft: '8px' }}>{song.bpm} BPM</span>}
                          {song.duration && <span style={{ color: 'var(--text-dim)', marginLeft: '8px' }}>⏱ {song.duration}</span>}
                        </p>
                      </div>
                    </div>

                    <div class="chapter-song-trigger">
                      <span class="trigger-label">{isCurrentPlaying ? t('playing_label') : t('listen_label')}</span>
                      <span class="play-circle-btn">
                        {isCurrentPlaying ? (
                          <span class="row-eq">
                            <span></span><span></span><span></span>
                          </span>
                        ) : (
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIOBOOKS */}
      {activeTab === 'audiobooks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-sand)' }}>
              {mediaCopy?.audiobook ?? t('book_audiobook_intro')} · {audiobooks.length} {t('book_audiobook_badge')}
            </div>

            {/* View Mode Toggle: Cards vs List */}
            <div style={{ display: 'inline-flex', border: '1px solid var(--border-medium)', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'var(--text-primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 14px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('view_grid')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? 'var(--text-primary)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 14px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('view_list')} ({audiobooks.length})
              </button>
            </div>
          </div>

          {/* Grid View (Cards for Audiobooks) */}
          {viewMode === 'grid' && (
            <div class="release-grid">
              {audiobooks.map((ab, idx) => {
                const isCurrent = activeTrack.value?.id === ab.id;
                const isCurrentPlaying = isCurrent && isPlaying.value;
                return (
                  <div
                    key={ab.id}
                    class="release-card"
                    onClick={() => handlePlay(ab)}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: isCurrent ? '1px solid var(--accent-sand)' : '1px solid var(--border-subtle)',
                      boxShadow: isCurrent ? '0 0 20px rgba(212,180,131,0.2)' : 'none'
                    }}
                  >
                    <div class="card-cover-box" style={{ marginBottom: '16px' }}>
                      <div class="card-track-number">{String(idx + 1).padStart(2, '0')}</div>
                      <img
                        src={getMediaUrl(ab.cover) || '/covers/was-das-meer-bewahrte.svg'}
                        alt=""
                        class="card-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div class="card-play-hover" style={isCurrentPlaying ? { opacity: 1 } : {}}>
                        {isCurrentPlaying ? (
                          <div class="card-eq">
                            <span></span><span></span><span></span>
                          </div>
                        ) : (
                          <div class="play-circle-btn" title={t('play_label')}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginLeft: '2px' }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div class="card-meta-top">
                      <span>{translatePlaceName(ab.place_name) || (mediaCopy ? '' : t('default_place'))}</span>
                      {ab.duration && <span>⏱ {ab.duration}</span>}
                    </div>

                    <h3 class="card-title" style={{ fontSize: '17px', marginBottom: '6px' }}>
                      {ab.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--accent-sand)', marginBottom: '8px' }}>
                      {translateSubtitle(ab.subtitle)}
                    </p>

                    {ab.description && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '16px' }}>
                        „{ab.description.slice(0, 110)}...“
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                        {t('audiobook_reading_tag')}
                      </span>
                      <span style={{ fontSize: '11px', color: isCurrentPlaying ? '#fff' : 'var(--accent-sand)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: isCurrentPlaying ? 600 : 400 }}>
                        {isCurrentPlaying ? t('playing_label') : t('play_label')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View (Mobile-optimized responsive rows for Audiobooks) */}
          {viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '1100px' }}>
              {audiobooks.map((ab, idx) => {
                const isCurrent = activeTrack.value?.id === ab.id;
                const isCurrentPlaying = isCurrent && isPlaying.value;
                return (
                  <div
                    key={ab.id}
                    class={`chapter-row ${isCurrent ? 'is-active' : ''}`}
                    onClick={() => handlePlay(ab)}
                  >
                    <div class="chapter-num">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div class="chapter-info">
                      {ab.cover && (
                        <img
                          src={getMediaUrl(ab.cover)}
                          alt=""
                          class="chapter-thumb"
                        />
                      )}
                      <div class="chapter-text-block">
                        <h4>{ab.title}</h4>
                        <p>
                          {translateSubtitle(ab.subtitle)} {ab.place_name && `· ${translatePlaceName(ab.place_name)}`}
                          {ab.duration && <span style={{ color: 'var(--text-dim)', marginLeft: '8px' }}>⏱ {ab.duration}</span>}
                        </p>
                      </div>
                    </div>

                    <div class="chapter-song-trigger">
                      <span class="trigger-label">{isCurrentPlaying ? t('playing_label') : t('listen_label')}</span>
                      <span class="play-circle-btn">
                        {isCurrentPlaying ? (
                          <span class="row-eq">
                            <span></span><span></span><span></span>
                          </span>
                        ) : (
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
