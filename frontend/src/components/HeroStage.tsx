import { Release } from '../types';
import { playTrack, openDrawer } from '../player/playerStore';
import { t, translatePlaceName, translateSubtitle } from '../i18n';
import { getTrackDescription, getTrackStory } from '../i18n/contentTranslations';

interface HeroStageProps {
  featuredRelease: Release | null;
}

export function HeroStage({ featuredRelease }: HeroStageProps) {
  const handlePlayNow = () => {
    if (featuredRelease) {
      playTrack(featuredRelease, true);
    }
  };

  return (
    <section class="hero-stage">
      <div class="hero-super">
        {t('hero_super')}
      </div>

      <h1 class="hero-headline">
        FREIBERGER
      </h1>

      <p class="hero-subline">
        {t('hero_tagline')}
      </p>

      {featuredRelease && (
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>●</span> {t('hero_featured_label')}
          </div>

          <div class="now-playing-banner">
            <div
              class="now-playing-cover-wrapper"
              onClick={handlePlayNow}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlayNow();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={featuredRelease.title}
            >
              <img
                src={featuredRelease.cover || '/covers/was-das-meer-bewahrte.svg'}
                alt={featuredRelease.title}
                class="now-playing-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div class="now-playing-play-overlay">
                <div class="play-circle-btn">▶</div>
              </div>
            </div>

            <div class="now-playing-content">
              <div>
                <div class="meta-row">
                  <span>{featuredRelease.genre || 'Future Garage'}</span>
                  <span class="meta-dot">·</span>
                  <span>{translatePlaceName(featuredRelease.place_name) || t('default_place')}</span>
                  {featuredRelease.bpm && (
                    <>
                      <span class="meta-dot">·</span>
                      <span style={{ color: 'var(--accent-sand)' }}>{featuredRelease.bpm} BPM</span>
                    </>
                  )}
                  {featuredRelease.duration && (
                    <>
                      <span class="meta-dot">·</span>
                      <span>{featuredRelease.duration}</span>
                    </>
                  )}
                </div>

                <h2 class="now-playing-title">
                  {featuredRelease.title}
                </h2>

                {featuredRelease.subtitle && (
                  <div class="now-playing-subtitle">
                    {translateSubtitle(featuredRelease.subtitle)}
                  </div>
                )}

                <p class="now-playing-description">
                  {getTrackDescription(featuredRelease) || getTrackStory(featuredRelease)}
                </p>
              </div>

              <div class="now-playing-actions">
                <button
                  onClick={handlePlayNow}
                  class="btn-editorial btn-editorial-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{t('hero_btn_play').replace(' ▶', '')}</span>
                </button>
                <button
                  onClick={() => {
                    if (featuredRelease) playTrack(featuredRelease, false);
                    openDrawer();
                  }}
                  class="btn-editorial btn-editorial-ghost"
                >
                  {t('hero_btn_details')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
