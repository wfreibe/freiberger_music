import { useRef, useEffect } from 'preact/hooks';
import { Release } from '../types';
import { playTrack, activeTrack, isPlaying } from '../player/playerStore';
import { getMediaUrl } from '../utils/media';
import { translateSubtitle, translatePlaceName } from '../i18n';

interface ReleaseSliderProps {
  title: string;
  subtitle?: string;
  releases: Release[];
}

export function ReleaseSlider({ title, subtitle, releases }: ReleaseSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Mouse wheel horizontal scroll handler
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section class="content-section">
      <div class="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h3 class="section-title">
            {title} <span style={{ fontSize: '13px', color: 'var(--accent-sand)', opacity: 0.8, marginLeft: '8px' }}>({releases.length} TITEL)</span>
          </h3>
          {subtitle && <div class="section-subtitle">{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => scroll('left')}
            class="slider-nav-btn"
            aria-label="Nach links scrollen"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            class="slider-nav-btn"
            aria-label="Nach rechts scrollen"
          >
            ›
          </button>
        </div>
      </div>

      <div class="horizontal-scroller" ref={scrollerRef}>
        {releases.map((rel, idx) => (
          <div
            key={rel.id}
            class="release-card"
            onClick={() => playTrack(rel, true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playTrack(rel, true);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${rel.title} - ${rel.subtitle || ''}`}
            style={activeTrack.value?.id === rel.id ? { borderColor: 'var(--accent-sand)', boxShadow: '0 0 20px rgba(212,180,131,0.2)' } : {}}
          >
            {(() => {
              const isCurrent = activeTrack.value?.id === rel.id;
              const isCurrentPlaying = isCurrent && isPlaying.value;
              return (
                <div class="card-cover-box">
                  <div class="card-track-number">{String(idx + 1).padStart(2, '0')}</div>
                  <img
                    src={getMediaUrl(rel.cover) || '/covers/was-das-meer-bewahrte.svg'}
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
                      <div class="play-circle-btn" style={{ width: '48px', height: '48px' }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginLeft: '2px' }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div class="card-meta-top">
              <span>{rel.genre || 'Single'}</span>
              {rel.bpm && <span style={{ color: 'var(--accent-sand)' }}>{rel.bpm} BPM</span>}
            </div>

            <h4 class="card-title">{rel.title}</h4>
            <div class="card-subtitle">
              {translateSubtitle(rel.subtitle) || translatePlaceName(rel.place_name) || 'FREIBERGER'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
