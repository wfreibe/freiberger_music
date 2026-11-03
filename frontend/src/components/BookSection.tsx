import { useState } from 'preact/hooks';
import { Book, Release } from '../types';
import { playTrack, activeTrack, isPlaying } from '../player/playerStore';
import { navigate } from '../router';
import { t, translatePlaceName, translateSubtitle } from '../i18n';

interface BookSectionProps {
  book: Book | null;
  songs?: Release[];
  audiobooks?: Release[];
}

export function BookSection({ book, songs = [], audiobooks = [] }: BookSectionProps) {
  const [activeTab, setActiveTab] = useState<'songs' | 'audiobooks'>('songs');

  if (!book) return null;

  return (
    <section class="content-section">
      <div class="book-stage">
        {/* Left Column: Book Details & Formats */}
        <div class="book-sidebar">
          <div style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '14px' }}>
            {t('book_super')}
          </div>

          <h2 class="book-title-large">
            {book.title}
          </h2>

          <div class="book-subtitle-text">
            {book.subtitle}
          </div>

          <div class="book-author-text">
            {book.author}
          </div>

          <div class="book-formats-badges">
            {book.formats?.split('·').map((f) => (
              <span key={f.trim()} class="book-format-chip">
                {f.trim()}
              </span>
            ))}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
            {book.description}
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button
              onClick={() => navigate('/die-orte-die-uns-sahen')}
              class="btn-editorial btn-editorial-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {t('book_open_page')}
            </button>
          </div>
        </div>

        {/* Right Column: Tab Switcher & Content */}
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <button
              onClick={() => setActiveTab('songs')}
              style={{
                background: activeTab === 'songs' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'songs' ? 'var(--bg-primary)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('book_tab_songs')} ({songs.length})
            </button>
            <button
              onClick={() => setActiveTab('audiobooks')}
              style={{
                background: activeTab === 'audiobooks' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'audiobooks' ? 'var(--bg-primary)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('book_tab_audiobook')} ({audiobooks.length})
            </button>
          </div>

          <div class="chapters-list">
            {activeTab === 'songs' && songs.map((song, idx) => {
              const isCurrent = activeTrack.value?.id === song.id;
              const isCurrentPlaying = isCurrent && isPlaying.value;
              return (
                <div
                  key={song.id}
                  class={`chapter-row ${isCurrent ? 'is-active' : ''}`}
                  onClick={() => playTrack(song, true)}
                >
                  <div class="chapter-num">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div class="chapter-info">
                    <div class="chapter-text-block">
                      <h4>{song.title}</h4>
                      <p>
                        {translatePlaceName(song.place_name) || t('default_place')}
                        {song.bpm && ` · ${song.bpm} BPM`}
                        {song.duration && ` · ${song.duration}`}
                      </p>
                    </div>
                  </div>
                  <div class="chapter-song-trigger">
                    <span class="trigger-label">{isCurrentPlaying ? t('playing_label') : t('book_listen')}</span>
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

            {activeTab === 'audiobooks' && audiobooks.map((ab, idx) => {
              const isCurrent = activeTrack.value?.id === ab.id;
              const isCurrentPlaying = isCurrent && isPlaying.value;
              return (
                <div
                  key={ab.id}
                  class={`chapter-row ${isCurrent ? 'is-active' : ''}`}
                  onClick={() => playTrack(ab, true)}
                >
                  <div class="chapter-num">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div class="chapter-info">
                    <div class="chapter-text-block">
                      <h4>{ab.title}</h4>
                      <p>
                        {translateSubtitle(ab.subtitle)}
                        {ab.duration && ` · ${ab.duration}`}
                      </p>
                    </div>
                  </div>
                  <div class="chapter-song-trigger">
                    <span class="trigger-label">{isCurrentPlaying ? t('playing_label') : t('book_listen')}</span>
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
        </div>
      </div>
    </section>
  );
}
