import {
  activeTrack,
  isPlaying,
  togglePlay,
  toggleDrawer,
  isDrawerOpen,
  playNextTrack,
  playPrevTrack,
  seekTo,
  progressPercent,
  formattedCurrentTime,
  formattedTotalDuration
} from '../player/playerStore';
import { isAmbientPlaying, toggleAmbientSound } from '../player/ambientSound';
import { t, translatePlaceName } from '../i18n';

export function PlayerBar() {
  const track = activeTrack.value;
  const playing = isPlaying.value;
  const drawerOpen = isDrawerOpen.value;
  const ambientActive = isAmbientPlaying.value;

  // Default display track if user hasn't clicked any track yet
  const displayTitle = track ? track.title : 'Was das Meer bewahrte';
  const displayMeta = track
    ? `${track.bpm ? track.bpm + ' BPM · ' : ''}${track.genre || 'Future Garage'}${track.place_name ? ' · ' + translatePlaceName(track.place_name) : ''}`
    : 'FREIBERGER · FUTURE GARAGE · 129 BPM';
  const displayCover = track?.cover || '/covers/was-das-meer-bewahrte.svg';
  const youtubeUrl = track?.youtube_id
    ? `https://www.youtube.com/watch?v=${track.youtube_id}`
    : 'https://www.youtube.com';

  return (
    <footer class="player-bar" aria-label="Audio Player">
      {/* Left: Track Info & Click to open drawer */}
      <div
        class="player-track-info"
        onClick={toggleDrawer}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDrawer();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={t('player_details')}
      >
        <img
          src={displayCover}
          alt=""
          class="player-mini-cover"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div class="player-text">
          <div class="player-track-title">
            <span>♫ {displayTitle}</span>
            <span class="player-artist-tag">· FREIBERGER</span>
            {playing && (
              <div class="player-live-eq" title="Wiedergabe aktiv">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
              </div>
            )}
          </div>
          <div class="player-track-meta">
            {displayMeta}
          </div>
        </div>
      </div>

      {/* Center: Controls & Scrubber */}
      <div class="player-center-section">
        <div class="player-controls">
          <button
            onClick={(e) => {
              e.stopPropagation();
              playPrevTrack();
            }}
            class="player-btn player-skip-btn"
            aria-label={t('player_prev')}
            title={t('player_prev')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M6 6a1 1 0 0 1 2 0v12a1 1 0 0 1-2 0V6zm3.2 6.74a1 1 0 0 0 0-1.48L17.13 4.8c.67-.56 1.67-.09 1.67.79v12.82c0 .88-1 1.35-1.67.79l-7.93-6.46z"/>
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            class={`player-btn player-play-btn ${playing ? 'is-playing' : ''}`}
            aria-label={playing ? t('player_pause') : t('player_play')}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <rect x="6" y="4.5" width="4" height="15" rx="1.5"/>
                <rect x="14" y="4.5" width="4" height="15" rx="1.5"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginLeft: '1.5px' }}>
                <path d="M7 4.5v15c0 .65.7 1.05 1.25.7l12-7.5c.55-.35.55-1.05 0-1.4l-12-7.5C7.7 3.45 7 3.85 7 4.5z"/>
              </svg>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playNextTrack();
            }}
            class="player-btn player-skip-btn"
            aria-label={t('player_next')}
            title={t('player_next')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M16 6a1 1 0 0 1 2 0v12a1 1 0 0 1-2 0V6zm-1.2 6.74a1 1 0 0 1 0-1.48L6.87 4.8C6.2 4.24 5.2 4.71 5.2 5.59v12.82c0 .88 1 1.35 1.67.79l7.93-6.46z"/>
            </svg>
          </button>
        </div>

        <div class="player-scrubber-box">
          <span class="player-time">{formattedCurrentTime.value}</span>
          <div class="player-slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercent.value}
              onInput={(e) => seekTo(parseFloat((e.target as HTMLInputElement).value))}
              class="player-range-slider"
              aria-label="Progress scrubber"
              style={{
                background: `linear-gradient(to right, var(--accent-sand) ${progressPercent.value}%, rgba(255,255,255,0.14) ${progressPercent.value}%)`
              }}
            />
          </div>
          <span class="player-time">{formattedTotalDuration.value}</span>
        </div>
      </div>

      {/* Right: Actions (Ambient Sound toggle, Drawer toggle & YouTube link) */}
      <div class="player-actions-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleAmbientSound();
          }}
          class={`player-ambient-btn ${ambientActive ? 'active' : ''}`}
          aria-label={ambientActive ? t('player_ambient_on') : t('player_ambient_off')}
          title={ambientActive ? t('player_ambient_on') : t('player_ambient_off')}
        >
          <span class="ambient-icon">🌊</span>
          <span class="ambient-text">{ambientActive ? t('player_ambient_on') : t('player_ambient_off')}</span>
          {ambientActive && <span class="ambient-beacon" />}
        </button>

        <button
          onClick={toggleDrawer}
          class="player-expand-btn"
          aria-label={drawerOpen ? t('player_close') : t('player_details')}
        >
          <span>{drawerOpen ? t('player_close') : t('player_details')}</span>
        </button>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="player-expand-btn player-youtube-link"
          style={{ color: 'var(--accent-sand)' }}
        >
          {t('player_watch_youtube')}
        </a>
      </div>
    </footer>
  );
}
