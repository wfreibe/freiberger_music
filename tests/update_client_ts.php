<?php
// Generate updated frontend/src/api/client.ts from SQLite

require_once __DIR__ . '/../api/bootstrap.php';

$pdo = getDbConnection();

// Fetch releases with joins
$stmt = $pdo->query("
    SELECT r.*,
           p.name AS place_name, p.slug AS place_slug, p.accent_color AS place_accent,
           c.title AS chapter_title, c.chapter_number,
           s.title AS series_title, s.slug AS series_slug
    FROM releases r
    LEFT JOIN places p ON r.place_id = p.id
    LEFT JOIN chapters c ON r.chapter_id = c.id
    LEFT JOIN series s ON r.series_id = s.id
    ORDER BY r.sort_order ASC
");
$releases = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch places
$places = $pdo->query("
    SELECT p.*, COUNT(r.id) AS track_count
    FROM places p
    LEFT JOIN releases r ON r.place_id = p.id
    GROUP BY p.id
    ORDER BY p.sort_order ASC
")->fetchAll(PDO::FETCH_ASSOC);

// Fetch book
$book = $pdo->query("SELECT * FROM books WHERE id = 1")->fetch(PDO::FETCH_ASSOC);
$chStmt = $pdo->query("
    SELECT c.*,
           p.name AS place_name, p.slug AS place_slug, p.accent_color AS place_accent,
           r.id AS release_id, r.title AS release_title, r.slug AS release_slug,
           r.duration AS release_duration, r.bpm AS release_bpm, r.youtube_id AS release_youtube_id,
           r.cover AS release_cover
    FROM chapters c
    LEFT JOIN places p ON c.place_id = p.id
    LEFT JOIN releases r ON c.release_id = r.id
    ORDER BY c.chapter_number ASC
");
$book['chapters'] = $chStmt->fetchAll(PDO::FETCH_ASSOC);

$releasesJson = json_encode($releases, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$placesJson = json_encode($places, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$bookJson = json_encode($book, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$code = <<<TS
import { Release, Place, Book, Series } from '../types';

const getApiBase = () => '/api';

export async function fetchReleases(params?: { type?: 'song' | 'audiobook'; featured?: boolean; place?: string; series?: string }): Promise<Release[]> {
  try {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.featured !== undefined) query.set('featured', params.featured ? '1' : '0');
    if (params?.place) query.set('place', params.place);
    if (params?.series) query.set('series', params.series);

    const queryString = query.toString() ? `?\${query.toString()}` : '';
    const res = await fetch(`\${getApiBase()}/releases\${queryString}`);
    if (!res.ok) throw new Error(`HTTP \${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetch failed, returning fallback releases:', err);
    let rels = getFallbackReleases();
    if (params?.type) rels = rels.filter(r => r.type === params.type);
    return rels;
  }
}

export async function fetchReleaseBySlug(slug: string): Promise<Release | null> {
  try {
    const res = await fetch(`\${getApiBase()}/releases/\${slug}`);
    if (!res.ok) throw new Error(`HTTP \${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API fetch for release \${slug} failed, returning fallback:`, err);
    return getFallbackReleases().find(r => r.slug === slug) || null;
  }
}

export async function fetchPlaces(): Promise<Place[]> {
  try {
    const res = await fetch(`\${getApiBase()}/places`);
    if (!res.ok) throw new Error(`HTTP \${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetch for places failed, returning fallback:', err);
    return getFallbackPlaces();
  }
}

export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  try {
    const res = await fetch(`\${getApiBase()}/places/\${slug}`);
    if (!res.ok) throw new Error(`HTTP \${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API fetch for place \${slug} failed, returning fallback:`, err);
    const place = getFallbackPlaces().find(p => p.slug === slug);
    if (place) {
      place.releases = getFallbackReleases().filter(r => r.place_slug === slug);
    }
    return place || null;
  }
}

export async function fetchBook(slug: string = 'die-orte-die-mich-sahen'): Promise<Book | null> {
  try {
    const res = await fetch(`\${getApiBase()}/books/\${slug}`);
    if (!res.ok) throw new Error(`HTTP \${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API fetch for book \${slug} failed, returning fallback:`, err);
    return getFallbackBook();
  }
}

export async function fetchSeries(): Promise<Series[]> {
  try {
    const res = await fetch(`\${getApiBase()}/series`);
    if (!res.ok) throw new Error(`HTTP \${res.status}`);
    return await res.json();
  } catch (err) {
    return [
      { id: 1, slug: 'the-greece-chapters', title: 'THE GREECE CHAPTERS', sort_order: 1 }
    ];
  }
}

function getFallbackReleases(): Release[] {
  return {$releasesJson};
}

function getFallbackPlaces(): Place[] {
  return {$placesJson};
}

function getFallbackBook(): Book {
  return {$bookJson};
}
TS;

file_put_contents(__DIR__ . '/../frontend/src/api/client.ts', $code);
echo "✓ Successfully generated frontend/src/api/client.ts!\n";
