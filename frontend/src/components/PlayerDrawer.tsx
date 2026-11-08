import { ContentBlocks } from './ContentBlocks';
import { activeTrack, isDrawerOpen, closeDrawer, togglePlay, isPlaying } from '../player/playerStore';
import { YouTubeFacade } from './YouTubeFacade';
import { navigate } from '../router';
import { t, translatePlaceName, translateSubtitle } from '../i18n';
import { getTrackDescription, getTrackStory } from '../i18n/contentTranslations';

export function PlayerDrawer() {
  const track = activeTrack.value;
  const open = isDrawerOpen.value;

  if (!track) return null;

  const handlePlaceClick = () => {
    if (track.place_slug) {
      closeDrawer();
      navigate(`/places/${track.place_slug}`);
    }
  };

  const handleChapterClick = () => {
    closeDrawer();
    navigate('/die-orte-die-uns-sahen');
  };

  return (
    <div
      class={`player-drawer-backdrop ${open ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
    >
      <div class="player-drawer">
        <div class="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {t('drawer_archive_label')}
            </span>
            {track.genre && (
              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                {track.genre}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            class="player-btn"
            style={{ fontSize: '20px', padding: '8px', cursor: 'pointer' }}
            aria-label={t('player_close')}
          >
            ✕
          </button>
        </div>

        <div class="drawer-body">
          {/* Left Column: Visuals & YouTube Player */}
          <div>
            <YouTubeFacade
              youtubeId={track.youtube_id || ''}
              title={track.title}
              coverUrl={track.cover}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{t('drawer_tempo')}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{track.bpm ? `${track.bpm} BPM` : '—'}</div>
              </div>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{t('drawer_duration')}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{track.duration || '—'}</div>
              </div>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{t('drawer_place')}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{translatePlaceName(track.place_name) || '—'}</div>
              </div>
            </div>

            {track.place_name && (
              <div
                onClick={handlePlaceClick}
                style={{
                  marginTop: '16px',
                  padding: '14px 16px',
                  background: 'rgba(56, 119, 128, 0.1)',
                  border: '1px solid rgba(56, 119, 128, 0.25)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-turquoise)' }}>
                    {t('drawer_place')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>{translatePlaceName(track.place_name)}</div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--accent-turquoise)' }}>→</span>
              </div>
            )}

            {track.chapter_number && (
              <div
                onClick={handleChapterClick}
                style={{
                  marginTop: '12px',
                  padding: '14px 16px',
                  background: 'rgba(212, 180, 131, 0.08)',
                  border: '1px solid rgba(212, 180, 131, 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-sand)' }}>
                    {t('drawer_chapter')}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                    {track.chapter_title}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--accent-sand)' }}>{t('drawer_read_chapter')}</span>
              </div>
            )}
          </div>

          {/* Right Column: Editorial Texts, Background Story, Lyrics */}
          <div><ContentBlocks value={track.content_blocks}>
            <div style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '8px' }}>
              FREIBERGER · {track.series_title || 'THE GREECE CHAPTERS'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '8px' }}>
              {track.title}
            </h2>
            {track.subtitle && (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                {translateSubtitle(track.subtitle)}
              </p>
            )}

            {getTrackDescription(track) && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  {t('drawer_tab_story')}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {getTrackDescription(track)}
                </p>
              </div>
            )}

            {getTrackStory(track) && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  {t('drawer_tab_notes')}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {getTrackStory(track)}
                </p>
              </div>
            )}

            {track.lyrics && (
              <div style={{ marginBottom: '24px', padding: '16px 20px', background: 'var(--bg-surface-elevated)', borderRadius: '6px', borderLeft: '2px solid var(--accent-sand)' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  {t('drawer_tab_lyrics')}
                </div>
                <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {track.lyrics}
                </p>
              </div>
            )}

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={togglePlay}
                class="btn-editorial btn-editorial-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {isPlaying.value ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1.5" />
                    <rect x="14" y="4" width="4" height="16" rx="1.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                <span>{isPlaying.value ? t('player_pause') : t('player_play')}</span>
              </button>
              {track.youtube_id && (
                <a
                  href={`https://www.youtube.com/watch?v=${track.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-editorial btn-editorial-ghost"
                >
                  {t('player_watch_youtube')}
                </a>
              )}
            </div>
          </ContentBlocks><ContentBlocks value={track.chapter_content_blocks}/></div>
        </div>
      </div>
    </div>
  );
}
