import { ContentBlocks } from '../components/ContentBlocks';
import { useEffect, useState } from 'preact/hooks';
import { Place, Release } from '../types';
import { fetchPlaces, fetchPlaceBySlug, fetchReleases } from '../api/client';
import { setAmbientPlace, playTrack, setTrackList } from '../player/playerStore';
import { getCleanPath, navigate } from '../router';
import { GreeceMap } from '../components/GreeceMap';
import { t, translatePlaceName, translateSubtitle } from '../i18n';
import { getPlaceTagline, getPlaceDescription } from '../i18n/contentTranslations';

export function PlacesPage() {
  const path = getCleanPath();
  const segments = path.split('/').filter(Boolean);
  const slug = segments[0] === 'places' ? segments[1] : null;

  const [places, setPlaces] = useState<Place[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (slug) {
        const p = await fetchPlaceBySlug(slug);
        setCurrentPlace(p);
        if (p) setAmbientPlace(p);
      } else {
        const [list, rels] = await Promise.all([
          fetchPlaces(),
          fetchReleases({ type: 'song' })
        ]);
        setPlaces(list);
        setReleases(rels);
        setTrackList(rels);
        setAmbientPlace(null);
      }
      setLoading(false);
    }
    load();

    return () => {
      setAmbientPlace(null);
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {t('places_loading')}
        </span>
      </div>
    );
  }

  // Single Place View
  if (slug && currentPlace) {
    return (
      <div class="hero-stage" style={{ paddingBottom: '80px' }}><ContentBlocks value={currentPlace.content_blocks}>
        <div style={{ marginBottom: '24px' }}>
          <a
            href="#/places"
            onClick={(e) => {
              e.preventDefault();
              navigate('/places');
            }}
            style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}
          >
            {t('places_back_all')}
          </a>
        </div>

        <div class="hero-super" style={{ color: currentPlace.accent_color || 'var(--accent-turquoise)' }}>
          {currentPlace.coordinates || 'Griechenland'} · {currentPlace.greek_name}
        </div>

        <h1 class="hero-headline" style={{ color: currentPlace.accent_color || 'var(--text-primary)' }}>
          {translatePlaceName(currentPlace.name)}
        </h1>

        <div class="hero-subline" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '36px' }}>
          {getPlaceTagline(currentPlace)}
        </div>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '800px', marginBottom: '48px' }}>
          {getPlaceDescription(currentPlace)}
        </p>

        {/* Releases in this place */}
        {currentPlace.releases && currentPlace.releases.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '20px' }}>
              {t('places_music_from')} {translatePlaceName(currentPlace.name)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {currentPlace.releases.map((rel) => (
                <div
                  key={rel.id}
                  class="release-card"
                  onClick={() => playTrack(rel, true)}
                >
                  <div class="card-cover-box">
                    <img src={rel.cover || '/covers/was-das-meer-bewahrte.svg'} alt={rel.title} class="card-cover" />
                    <div class="card-play-hover">
                      <div class="play-circle-btn" style={{ width: '48px', height: '48px', fontSize: '16px' }}>▶</div>
                    </div>
                  </div>
                  <div class="card-meta-top">
                    <span>{rel.genre || 'Single'}</span>
                    {rel.bpm && <span style={{ color: 'var(--accent-sand)' }}>{rel.bpm} BPM</span>}
                  </div>
                  <h4 class="card-title">{rel.title}</h4>
                  <div class="card-subtitle">{translateSubtitle(rel.subtitle) || 'FREIBERGER'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapters in this place */}
        {currentPlace.chapters && currentPlace.chapters.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '20px' }}>
              {t('places_chapters_at')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px' }}>
              {currentPlace.chapters.map((ch) => (
                <div
                  key={ch.id}
                  class="chapter-row"
                  onClick={() => navigate('/die-orte-die-uns-sahen')}
                >
                  <div class="chapter-num">
                    {String(ch.chapter_number).padStart(2, '0')}
                  </div>
                  <div class="chapter-info">
                    <h4>{ch.title}</h4>
                    <p>{translateSubtitle(ch.subtitle)}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-sand)', letterSpacing: '0.1em' }}>
                    {t('places_view_in_book')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ContentBlocks></div>
    );
  }

  // All Places View (Map or Grid)
  return (
    <div class="hero-stage" style={{ paddingBottom: '80px' }}>
      <div class="hero-super">
        {t('places_super')}
      </div>
      <h1 class="hero-headline">
        {t('places_title')}
      </h1>
      <p class="hero-subline">
        {t('places_grid_subline')}
      </p>

      {/* View Switcher: Map vs Grid */}
      <div class="places-view-switcher" style={{ marginTop: '36px', marginBottom: '28px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setViewMode('map')}
          class={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
          aria-label="Map View"
        >
          🗺️ {t('map_title')}
        </button>
        <button
          onClick={() => setViewMode('grid')}
          class={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          aria-label="Grid View"
        >
          ⊞ {t('view_grid')}
        </button>
      </div>

      {viewMode === 'map' ? (
        <div style={{ marginTop: '16px' }}>
          <GreeceMap
            places={places}
            releases={releases}
            onSelectPlace={(p) => navigate(`/places/${p.slug}`)}
          />

          {/* Compact Place Chips below Map for direct navigation */}
          <div class="map-places-strip">
            {places.map((p) => (
              <button
                key={p.id}
                class="place-chip-btn"
                onClick={() => navigate(`/places/${p.slug}`)}
                onMouseEnter={() => setAmbientPlace(p)}
                onMouseLeave={() => setAmbientPlace(null)}
                style={{
                  borderLeftColor: p.accent_color || 'var(--accent-sand)'
                }}
              >
                <span class="chip-name">{translatePlaceName(p.name)}</span>
                <span class="chip-greek">{p.greek_name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div class="places-grid" style={{ marginTop: '20px' }}>
          {places.map((p) => (
            <div
              key={p.id}
              class="place-item-card"
              onMouseEnter={() => setAmbientPlace(p)}
              onMouseLeave={() => setAmbientPlace(null)}
              onClick={() => navigate(`/places/${p.slug}`)}
            >
              <div>
                <div class="place-badge-tag">{p.coordinates}</div>
                <h3 class="place-card-name" style={{ color: p.accent_color || 'var(--text-primary)' }}>
                  {translatePlaceName(p.name)}
                </h3>
                <div class="place-card-greek">{p.greek_name}</div>
                <p class="place-card-tagline">{getPlaceTagline(p)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {p.track_count} {t('places_works')}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--accent-sand)' }}>
                  {t('places_explore')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
