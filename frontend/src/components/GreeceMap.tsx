import { useState } from 'preact/hooks';
import { Place, Release } from '../types';
import { setAmbientPlace, playTrack } from '../player/playerStore';
import { navigate } from '../router';
import { t, translatePlaceName } from '../i18n';

interface GreeceMapProps {
  places: Place[];
  releases?: Release[];
  onSelectPlace?: (place: Place) => void;
  selectedSlug?: string | null;
}

interface MapPin {
  slug: string;
  name: string;
  greekName: string;
  x: number;
  y: number;
  color: string;
  labelAnchor: 'start' | 'middle' | 'end';
  labelDx: number;
  labelDy: number;
}

// Geographically projected SVG coordinates (800x580 coordinate system)
const MAP_PINS: Record<string, Omit<MapPin, 'slug' | 'name' | 'greekName' | 'color'>> = {
  corfu: { x: 88, y: 92, labelAnchor: 'start', labelDx: 14, labelDy: 4 },
  zakynthos: { x: 164, y: 260, labelAnchor: 'end', labelDx: -14, labelDy: 4 },
  athens: { x: 386, y: 242, labelAnchor: 'start', labelDx: 14, labelDy: -8 },
  naxos: { x: 516, y: 322, labelAnchor: 'start', labelDx: 14, labelDy: 4 },
  santorini: { x: 523, y: 387, labelAnchor: 'end', labelDx: -14, labelDy: 8 },
  kos: { x: 667, y: 342, labelAnchor: 'start', labelDx: 14, labelDy: 4 },
  rhodes: { x: 740, y: 384, labelAnchor: 'end', labelDx: -14, labelDy: 4 },
  crete: { x: 472, y: 492, labelAnchor: 'middle', labelDx: 0, labelDy: 20 },
};

export function GreeceMap({ places, releases = [], onSelectPlace, selectedSlug }: GreeceMapProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeSlug = hoveredSlug || selectedSlug;
  const activePlace = places.find((p) => p.slug === activeSlug) || null;

  // Find associated song for active place
  const activeSong = activePlace
    ? releases.find((r) => r.place_id === activePlace.id || r.place_slug === activePlace.slug)
    : null;

  const handleMouseEnter = (place: Place) => {
    setHoveredSlug(place.slug);
    setAmbientPlace(place);
  };

  const handleMouseLeave = () => {
    setHoveredSlug(null);
    setAmbientPlace(null);
  };

  const handleClick = (place: Place) => {
    if (onSelectPlace) {
      onSelectPlace(place);
    } else {
      navigate(`/places/${place.slug}`);
    }
  };

  const handlePlaySong = (e: MouseEvent, song: Release) => {
    e.stopPropagation();
    playTrack(song, true);
  };

  return (
    <div class="greece-map-wrapper">
      <div class="greece-map-header">
        <div>
          <span class="map-super-tag">{t('map_title')}</span>
          <h3 class="map-title-text">{t('map_subtitle')}</h3>
        </div>
        <div class="map-hint-text">
          <span>{t('map_hover_hint')}</span>
        </div>
      </div>

      <div class="greece-map-stage">
        <svg
          viewBox="0 0 800 580"
          class="greece-map-svg"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive Map of Greece"
        >
          <defs>
            {/* Background Gradients */}
            <radialGradient id="aegeanSeaGlow" cx="60%" cy="50%" r="60%">
              <stop offset="0%" stop-color="#142634" stop-opacity="0.55" />
              <stop offset="60%" stop-color="#0e171f" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#0b0c0e" stop-opacity="0" />
            </radialGradient>

            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#191e24" />
              <stop offset="100%" stop-color="#121519" />
            </linearGradient>

            {/* Glowing filter for active pins */}
            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sea Glow Backdrop */}
          <rect width="800" height="580" fill="url(#aegeanSeaGlow)" />

          {/* Subtle Navigational Coordinate Grid */}
          <g class="map-grid-lines" stroke="rgba(232, 229, 222, 0.04)" stroke-width="1" stroke-dasharray="3,6">
            <line x1="50" y1="120" x2="750" y2="120" />
            <line x1="50" y1="240" x2="750" y2="240" />
            <line x1="50" y1="360" x2="750" y2="360" />
            <line x1="50" y1="480" x2="750" y2="480" />
            <line x1="160" y1="40" x2="160" y2="540" />
            <line x1="320" y1="40" x2="320" y2="540" />
            <line x1="480" y1="40" x2="480" y2="540" />
            <line x1="640" y1="40" x2="640" y2="540" />
          </g>

          {/* Coordinate Labels */}
          <g class="map-coord-labels" fill="rgba(232, 229, 222, 0.18)" font-family="var(--font-mono)" font-size="9">
            <text x="56" y="115">39°N</text>
            <text x="56" y="235">38°N</text>
            <text x="56" y="355">37°N</text>
            <text x="56" y="475">35°N</text>
            <text x="165" y="550">21°E</text>
            <text x="325" y="550">23°E</text>
            <text x="485" y="550">25°E</text>
            <text x="645" y="550">27°E</text>
          </g>

          {/* Sea Watermark Typography */}
          <g class="map-watermarks" fill="rgba(232, 229, 222, 0.08)" font-weight="600" letter-spacing="0.25em">
            <text x="100" y="340" font-size="11">IONIAN SEA · ΙΟΝΙΟ</text>
            <text x="440" y="200" font-size="13">AEGEAN SEA · ΑΙΓΑΙΟ ΠΕΛΑΓΟΣ</text>
            <text x="420" y="450" font-size="10">SEA OF CRETE · ΚΡΗΤΙΚΟ ΠΕΛΑΓΟΣ</text>
          </g>

          {/* Landmass Paths (Detailed Vector Silhouettes of Greece) */}
          <g class="map-landmass" fill="url(#landGradient)" stroke="rgba(232, 229, 222, 0.12)" stroke-width="1" stroke-linejoin="round">
            {/* 1. Mainland Greece (Epirus, Thessaly, Macedonia, Central Greece, Attica) */}
            <path d="M 60 20 L 140 18 L 220 22 L 310 30 L 390 40 L 450 65 L 430 95 L 380 120 L 350 160 L 360 190 L 386 230 L 410 248 L 400 265 L 375 255 L 340 240 L 310 238 L 280 230 L 250 215 L 200 195 L 180 160 L 150 140 L 130 90 L 100 60 Z" />

            {/* 2. Peloponnese */}
            <path d="M 285 242 L 325 244 L 348 275 L 365 315 L 350 350 L 325 390 L 305 395 L 290 350 L 260 380 L 245 365 L 265 325 L 235 320 L 220 280 L 250 250 Z" />

            {/* 3. Euboea (Evia) */}
            <path d="M 370 145 L 395 130 L 430 170 L 445 220 L 430 255 L 415 240 L 385 180 Z" />

            {/* 4. Crete (Elongated southern island) */}
            <path d="M 360 488 L 400 482 L 470 486 L 530 492 L 575 498 L 565 515 L 515 516 L 460 512 L 410 508 L 365 504 Z" />

            {/* 5. Ionian Islands */}
            {/* Corfu */}
            <path d="M 82 78 L 94 85 L 90 108 L 82 102 Z" />
            {/* Lefkada */}
            <path d="M 160 175 L 168 178 L 165 195 L 158 190 Z" />
            {/* Kefalonia & Ithaka */}
            <path d="M 152 210 L 168 215 L 170 238 L 155 235 Z" />
            {/* Zakynthos */}
            <path d="M 158 252 L 170 256 L 168 272 L 156 268 Z" />

            {/* 6. Cyclades Islands */}
            {/* Andros & Tinos */}
            <path d="M 445 258 L 460 268 L 452 278 Z" />
            <path d="M 465 278 L 476 288 L 470 294 Z" />
            {/* Syros & Mykonos & Delos */}
            <ellipse cx="468" cy="308" rx="5" ry="6" />
            <ellipse cx="498" cy="302" rx="7" ry="5" />
            <circle cx="490" cy="312" r="3" />
            {/* Paros */}
            <ellipse cx="496" cy="336" rx="9" ry="8" />
            {/* Naxos */}
            <path d="M 510 312 L 526 318 L 528 338 L 512 342 L 506 325 Z" />
            {/* Ios & Milos */}
            <ellipse cx="504" cy="368" rx="6" ry="7" />
            <ellipse cx="440" cy="348" rx="8" ry="6" />
            {/* Santorini (Thira & Thirassia caldera crescent) */}
            <path d="M 520 378 Q 528 384 525 398 Q 518 395 517 385 Z" />
            <circle cx="515" cy="388" r="2.5" />

            {/* 7. Dodecanese & Eastern Aegean */}
            {/* Lesbos & Chios & Samos */}
            <ellipse cx="585" cy="140" rx="14" ry="12" />
            <ellipse cx="580" cy="225" rx="8" ry="14" />
            <ellipse cx="625" cy="285" rx="12" ry="6" />
            {/* Patmos & Kalymnos */}
            <circle cx="630" cy="315" r="4" />
            <ellipse cx="652" cy="330" rx="5" ry="7" />
            {/* Kos */}
            <path d="M 658 338 L 680 342 L 678 348 L 656 345 Z" />
            {/* Rhodes */}
            <path d="M 730 368 L 748 375 L 752 405 L 735 412 L 726 385 Z" />
            {/* Karpathos */}
            <ellipse cx="678" cy="452" rx="5" ry="14" transform="rotate(15 678 452)" />
          </g>

          {/* Interactive Place Beacon Markers */}
          <g class="map-beacons">
            {places.map((place) => {
              const pinMeta = MAP_PINS[place.slug];
              if (!pinMeta) return null;

              const isHovered = hoveredSlug === place.slug;
              const isSelected = selectedSlug === place.slug;
              const isActive = isHovered || isSelected;
              const placeColor = place.accent_color || '#387780';

              return (
                <g
                  key={place.id}
                  class={`map-pin-group ${isActive ? 'active' : ''}`}
                  transform={`translate(${pinMeta.x}, ${pinMeta.y})`}
                  onMouseEnter={() => handleMouseEnter(place)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(place)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClick(place);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${place.name} - ${place.tagline || ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer Pulsing Beacon Wave */}
                  <circle
                    r={isActive ? 22 : 12}
                    fill={placeColor}
                    fill-opacity={isActive ? 0.28 : 0.1}
                    class="beacon-pulse"
                  />

                  {/* Secondary Radar Ring */}
                  {isActive && (
                    <circle
                      r="16"
                      fill="none"
                      stroke={placeColor}
                      stroke-width="1.2"
                      stroke-opacity="0.6"
                      class="beacon-radar"
                    />
                  )}

                  {/* Center Solid Beacon Dot */}
                  <circle
                    r={isActive ? 5.5 : 3.8}
                    fill={placeColor}
                    stroke="#0b0c0e"
                    stroke-width="1.5"
                    filter={isActive ? 'url(#beaconGlow)' : undefined}
                    class="beacon-center"
                  />

                  {/* Place Name Tag */}
                  <text
                    x={pinMeta.labelDx}
                    y={pinMeta.labelDy}
                    text-anchor={pinMeta.labelAnchor}
                    font-family="var(--font-family)"
                    font-size={isActive ? '13' : '11'}
                    font-weight={isActive ? '700' : '500'}
                    letter-spacing="0.08em"
                    fill={isActive ? '#ffffff' : 'var(--text-secondary)'}
                    class="beacon-label"
                  >
                    {translatePlaceName(place.name)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic Detail Card / Popover for Hovered/Selected Place */}
        {activePlace && (
          <div class="map-floating-card">
            <div class="map-card-header">
              <span class="map-card-coords">{activePlace.coordinates}</span>
              <span
                class="map-card-badge"
                style={{
                  color: activePlace.accent_color || 'var(--accent-sand)',
                  borderColor: `${activePlace.accent_color || 'var(--accent-sand)'}44`
                }}
              >
                {activePlace.greek_name}
              </span>
            </div>

            <h4 class="map-card-title" style={{ color: activePlace.accent_color || 'var(--text-primary)' }}>
              {translatePlaceName(activePlace.name)}
            </h4>
            <p class="map-card-tagline">„{activePlace.tagline}“</p>

            {activeSong && (
              <div class="map-card-song-box">
                <div class="map-song-info">
                  <span class="map-song-label">♫ Soundtrack:</span>
                  <strong class="map-song-title">{activeSong.title}</strong>
                  {activeSong.duration && <span class="map-song-dur">· {activeSong.duration}</span>}
                </div>
                <button
                  class="map-card-play-btn"
                  onClick={(e) => handlePlaySong(e, activeSong)}
                  title={t('map_play_song')}
                >
                  ▶ {t('map_play_song')}
                </button>
              </div>
            )}

            <div class="map-card-footer">
              <button
                class="map-card-explore-link"
                onClick={() => navigate(`/places/${activePlace.slug}`)}
              >
                {t('map_explore_place')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
