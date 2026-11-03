import { Release, Place, Book, Series } from '../types';

export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/freiberger-music')) {
    return '/freiberger-music/api';
  }
  return '/api';
};

export async function fetchReleases(params?: {
  type?: 'song' | 'audiobook' | 'gard7';
  featured?: boolean;
  place?: string;
  series?: string;
}, options: { signal?: AbortSignal; throwOnError?: boolean } = {}): Promise<Release[]> {
  try {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.featured !== undefined) query.set('featured', params.featured ? '1' : '0');
    if (params?.place) query.set('place', params.place);
    if (params?.series) query.set('series', params.series);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${getApiBase()}/releases${queryString}`, { signal: options.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (options.throwOnError) throw err;
    console.error('API fetchReleases failed:', err);
    return [];
  }
}

export async function fetchReleaseBySlug(slug: string): Promise<Release | null> {
  try {
    const res = await fetch(`${getApiBase()}/releases/${slug}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API fetch for release ${slug} failed:`, err);
    return null;
  }
}

export async function fetchPlaces(): Promise<Place[]> {
  try {
    const res = await fetch(`${getApiBase()}/places`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API fetchPlaces failed:', err);
    return [];
  }
}

export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  try {
    const res = await fetch(`${getApiBase()}/places/${slug}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API fetch for place ${slug} failed:`, err);
    return null;
  }
}

export async function fetchBook(slug: string = 'die-orte-die-uns-sahen'): Promise<Book | null> {
  try {
    const res = await fetch(`${getApiBase()}/books/${slug}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API fetch for book ${slug} failed:`, err);
    return null;
  }
}

export async function fetchSeries(): Promise<Series[]> {
  try {
    const res = await fetch(`${getApiBase()}/series`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API fetchSeries failed:', err);
    return [];
  }
}

export async function searchContent(q: string): Promise<{ releases: Release[]; places: Place[]; chapters: any[] }> {
  try {
    const res = await fetch(`${getApiBase()}/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API search for "${q}" failed:`, err);
    return { releases: [], places: [], chapters: [] };
  }
}
