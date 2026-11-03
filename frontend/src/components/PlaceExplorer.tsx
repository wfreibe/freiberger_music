import { useState } from 'preact/hooks';
import { Place, Release } from '../types';
import { setAmbientPlace } from '../player/playerStore';
import { navigate } from '../router';
import { GreeceMap } from './GreeceMap';
import { t } from '../i18n';

interface PlaceExplorerProps {
  places: Place[];
  releases?: Release[];
}

export function PlaceExplorer({ places, releases = [] }: PlaceExplorerProps) {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  return (
    <section class="content-section">
      <div class="section-header">
        <div>
          <span class="section-super">GEOGRAFIE DER KLÄNGE</span>
          <h3 class="section-title">Places · Schauplätze</h3>
          <div class="section-subtitle">Acht klangliche Fixpunkte in Griechenland</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div class="places-view-toggle" style={{ display: 'flex', gap: '8px' }}>
            <button
              class={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map View"
            >
              🗺️ {t('map_title')}
            </button>
            <button
              class={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              ⊞ {t('view_grid')}
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div style={{ marginTop: '20px' }}>
          <GreeceMap
            places={places}
            releases={releases}
            onSelectPlace={(p) => navigate(`/places/${p.slug}`)}
          />
        </div>
      ) : (
        <div class="places-grid" style={{ marginTop: '20px' }}>
          {places.map((place) => (
            <div
              key={place.id}
              class="place-item-card"
              onMouseEnter={() => setAmbientPlace(place)}
              onMouseLeave={() => setAmbientPlace(null)}
              onClick={() => navigate(`/places/${place.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/places/${place.slug}`);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${place.name} - ${place.tagline || ''}`}
              style={{
                borderColor: place.accent_color ? `${place.accent_color}33` : undefined
              }}
            >
              <div>
                <div class="place-badge-tag">
                  {place.coordinates || 'Ägäis'}
                </div>
                <h4 class="place-card-name" style={{ color: place.accent_color || 'var(--text-primary)' }}>
                  {place.name}
                </h4>
                <div class="place-card-greek">{place.greek_name}</div>
                <p class="place-card-tagline">{place.tagline}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {place.track_count ? `${place.track_count} Werk${place.track_count > 1 ? 'e' : ''}` : 'Archiv'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--accent-sand)' }}>
                  {t('places_explore')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
