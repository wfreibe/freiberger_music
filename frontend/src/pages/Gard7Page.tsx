import { useEffect, useState } from 'preact/hooks';
import { Release } from '../types';
import { fetchReleases } from '../api/client';
import { playTrack, setTrackList } from '../player/playerStore';
import { getMediaUrl } from '../utils/media';
import { t } from '../i18n';

export function Gard7Page() {
  const [tracks, setTracks] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const all = await fetchReleases();
        const gard7Only = all.filter(r => r.type === 'gard7' || r.series_slug === 'gard-7');
        setTracks(gard7Only);
      } catch (err) {
        console.error('Failed loading GARD 7 tracks:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePlay = (track: Release) => {
    setTrackList(tracks);
    playTrack(track, true);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setTrackList(tracks);
      playTrack(tracks[0], true);
    }
  };

  const playlistUrl = 'https://www.youtube.com/playlist?list=PLOxk1FcckanQ';

  return (
    <div class="gard7-page-container">
      {/* 1. Hero Stage */}
      <section class="hero-stage" style={{ paddingBottom: '40px' }}>
        <div class="hero-super" style={{ color: 'var(--accent-sand)' }}>
          {t('gard7_super')}
        </div>

        <h1 class="hero-headline" style={{ letterSpacing: '0.04em' }}>
          GARD 7
        </h1>

        <p class="hero-subline" style={{ maxWidth: '720px' }}>
          {t('gard7_tagline')}
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginTop: '28px' }}>
          <button
            type="button"
            onClick={handlePlayAll}
            class="btn-editorial btn-editorial-primary"
            style={{ padding: '14px 28px', fontSize: '12px' }}
          >
            ▶ {t('gard7_play_all')}
          </button>

          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="btn-editorial btn-editorial-ghost"
            style={{ padding: '14px 28px', fontSize: '12px' }}
          >
            {t('gard7_view_youtube')} ↗
          </a>
        </div>
      </section>

      {/* 2. Tracks Section */}
      <section class="content-section" style={{ paddingTop: '10px', paddingBottom: '100px' }}>
        <div class="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h3 class="section-title">
              {t('gard7_videos_title')} <span style={{ fontSize: '13px', color: 'var(--accent-sand)', opacity: 0.8, marginLeft: '8px' }}>({tracks.length} {t('gard7_tracks_count')})</span>
            </h3>
            <div class="section-subtitle">
              {t('gard7_videos_subtitle')}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {t('home_loading')}
            </span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '28px' }}>
            {tracks.map((rel, idx) => (
              <div
                key={rel.id}
                class="release-card"
                onClick={() => handlePlay(rel)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlay(rel);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${rel.title} - ${rel.subtitle || ''}`}
                style={{ flex: 'none', width: '100%' }}
              >
                {/* 16:9 Cover Box */}
                <div class="card-cover-box" style={{ marginBottom: '16px' }}>
                  <div class="card-track-number">{String(idx + 1).padStart(2, '0')}</div>
                  <img
                    src={getMediaUrl(rel.cover) || `https://i.ytimg.com/vi/${rel.youtube_id}/maxresdefault.jpg`}
                    alt={rel.title}
                    class="card-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${rel.youtube_id}/hqdefault.jpg`;
                    }}
                  />
                  <div class="card-play-hover">
                    <div class="play-circle-btn" style={{ width: '56px', height: '56px' }}>
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ marginLeft: '3px' }}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div class="card-meta-top">
                  <span>{rel.genre || 'Electronic'}</span>
                  {rel.bpm && <span style={{ color: 'var(--accent-sand)' }}>{rel.bpm} BPM</span>}
                  {rel.duration && <span>{rel.duration}</span>}
                </div>

                <h4 class="card-title" style={{ fontSize: '18px', marginBottom: '6px' }}>
                  {rel.title}
                </h4>

                <div class="card-subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {t('gard7_official_video')}
                </div>

                {/* Direct Action */}
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent-sand)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
                    {t('play_label')}
                  </span>
                  {rel.youtube_id && (
                    <a
                      href={`https://www.youtube.com/watch?v=${rel.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '11px', color: 'var(--text-dim)', textDecoration: 'none' }}
                    >
                      YouTube ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
