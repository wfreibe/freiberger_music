import { useEffect, useMemo, useState } from 'preact/hooks';
import type { Release } from '../types';
import { fetchReleases } from '../api/client';
import { activeTrack, isPlaying, playTrack, setTrackList } from '../player/playerStore';
import { currentLang } from '../i18n';
import { catalogCopy } from '../i18n/catalog';
import { buildMediaCatalog, filterMediaCatalog, type CatalogEntry, type MediaKind, type MediaLanguage } from '../data/mediaCatalog';
import { getMediaUrl } from '../utils/media';

export function HomePage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [kind, setKind] = useState<MediaKind | 'all'>('all');
  const [language, setLanguage] = useState<MediaLanguage | 'all'>('all');
  const [query, setQuery] = useState('');
  const copy = catalogCopy[currentLang.value];

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    fetchReleases(undefined, { signal: controller.signal, throwOnError: true })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid release list');
        if (!cancelled) setReleases(data);
      })
      .catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => {
        window.clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [reloadKey]);

  const catalog = useMemo(() => buildMediaCatalog(releases), [releases]);
  const visible = useMemo(() => filterMediaCatalog(catalog, kind, language, query), [catalog, kind, language, query]);
  const featured = catalog.find(entry => entry.release.featured === 1) || catalog[0];
  const languages = (['de', 'en', 'fr', 'instrumental', 'unknown'] as const).filter(value => catalog.some(entry => entry.language === value));
  const resetFilters = () => { setKind('all'); setLanguage('all'); setQuery(''); };
  const handlePlay = (entry: CatalogEntry, queue: CatalogEntry[]) => {
    setTrackList(queue.map(item => item.release));
    playTrack(entry.release, true);
  };
  const cover = (release: Release) => getMediaUrl(release.cover) || getMediaUrl('/covers/was-das-meer-bewahrte.svg');
  const recoverCover = (image: HTMLImageElement, release: Release) => {
    const fallback = getMediaUrl('/covers/was-das-meer-bewahrte.svg');
    const thumbnail = release.youtube_id ? `https://i.ytimg.com/vi/${release.youtube_id}/mqdefault.jpg` : fallback;
    const source = image.getAttribute('src');
    if (source === fallback) return;
    image.src = source === thumbnail ? fallback : thumbnail;
  };

  return <div class="catalog-page">
    <section class="hero-stage catalog-intro">
      <div class="hero-super">FREIBERGER · GARD 7</div>
      <h1 class="hero-headline catalog-headline">{copy.title}</h1>
      <p class="hero-subline">{copy.intro}</p>
      {!loading && featured && <button type="button" class="catalog-featured"
        onClick={() => handlePlay(featured, catalog)} aria-label={`${copy.play}: ${featured.release.title}`}>
        <img src={cover(featured.release)} alt="" onError={event => recoverCover(event.currentTarget, featured.release)} />
        <span class="catalog-featured-text">
          <span class="hero-super">{copy.featured}</span>
          <strong>{featured.release.title}</strong>
          <span>{copy[featured.kind]} · {copy[featured.language]}{featured.release.duration ? ` · ${featured.release.duration}` : ''}</span>
        </span>
        <span class="play-circle-btn" aria-hidden="true">▶</span>
      </button>}
    </section>

    <section class="content-section catalog-collection" aria-labelledby="catalog-heading">
      <h2 id="catalog-heading" class="section-title">{copy.collection}</h2>
      <div class="catalog-filters">
        <div class="catalog-types" role="group" aria-label={copy.collection}>
          {(['all', 'music', 'audiobook'] as const).map(value => <button key={value} type="button"
            aria-pressed={kind === value} onClick={() => setKind(value)}>
            {copy[value]} <span>({loading ? '…' : value === 'all' ? catalog.length : catalog.filter(entry => entry.kind === value).length})</span>
          </button>)}
        </div>
        <div class="catalog-search-row">
          <label>{copy.language}
            <select value={language} onChange={event => setLanguage(event.currentTarget.value as MediaLanguage | 'all')}>
              <option value="all">{copy.allLanguages}</option>
              {languages.map(value => <option key={value} value={value}>{copy[value]}</option>)}
            </select>
          </label>
          <label>{copy.search}
            <input type="search" value={query} maxLength={120} placeholder={copy.search}
              onInput={event => setQuery(event.currentTarget.value)} />
          </label>
          {(kind !== 'all' || language !== 'all' || query) && <button type="button" class="btn-editorial btn-editorial-ghost" onClick={resetFilters}>{copy.reset}</button>}
        </div>
      </div>
      {loading ? <p role="status">{copy.loading}</p> : <>
        {failed && <div class="catalog-error" role="alert"><p>{copy.error}</p>
          <button type="button" class="btn-editorial btn-editorial-ghost" onClick={() => setReloadKey(value => value + 1)}>{copy.retry}</button>
        </div>}
        <p class="catalog-result-count" role="status" aria-live="polite">{visible.length} {copy.results}</p>
        {visible.length === 0 ? <div class="catalog-empty"><p>{copy.empty}</p>
          <button type="button" class="btn-editorial btn-editorial-ghost" onClick={resetFilters}>{copy.reset}</button>
        </div> : <div class="release-grid">
          {visible.map(entry => {
            const track = entry.release;
            const selected = activeTrack.value?.id === track.id;
            const playing = selected && isPlaying.value;
            return <button key={entry.key} type="button" class={`catalog-card ${selected ? 'is-active' : ''}`}
              onClick={() => handlePlay(entry, visible)} aria-label={`${copy.play}: ${track.title}`}>
              <span class="card-cover-box">
                <img src={cover(track)} alt="" class="card-cover" loading="lazy" onError={event => recoverCover(event.currentTarget, track)} />
                {entry.kind === 'audiobook' && track.chapter_number && <span class="card-track-number">{String(track.chapter_number).padStart(2, '0')}</span>}
                <span class="card-play-hover"><span class="play-circle-btn" aria-hidden="true">▶</span></span>
              </span>
              <span class="catalog-card-meta">{copy[entry.kind]} · {copy[entry.language]}</span>
              <span class="catalog-card-title">{track.title}</span>
              <span class="catalog-card-footer"><span>{track.duration}</span><span>{playing ? `♫ ${copy.playing}` : `▶ ${copy.play}`}</span></span>
            </button>;
          })}
        </div>}
      </>}
    </section>
  </div>;
}
