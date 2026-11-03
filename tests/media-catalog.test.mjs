import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';
const result = await build({ entryPoints: [fileURLToPath(new URL('../frontend/src/data/mediaCatalog.ts', import.meta.url))], bundle: true, format: 'esm', platform: 'node', write: false });
const { buildMediaCatalog, filterMediaCatalog } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
const release = (id, values = {}) => ({ id, slug: `test-${id}`, title: `Test ${id}`, type: 'song', youtube_id: `video-${id}`, ...values });

test('catalog merges English songs, deduplicates media and omits unplayable entries', () => {
 const input = [release(1, {youtube_id: 'cE5vYHKfJiw', title: 'Database title'}), release(2, {youtube_id: 'cE5vYHKfJiw'}), release(3, {youtube_id: null}), release(4, {youtube_id: null, audio_url: '/test.mp3'}), release(5, {youtube_id: null, audio_url: '/test.mp3'})];
 const catalog = buildMediaCatalog(input);
 assert.equal(catalog.length, 11);
 assert.equal(catalog.find(x => x.key === 'youtube:cE5vYHKfJiw').release.title, 'Database title');
 assert.equal(catalog.filter(x => x.key === 'audio:/test.mp3').length, 1);
 assert.equal(input.length, 5);
});

test('content language uses verified audio language, including all four GARD 7 songs', () => {
 const ids = ['SWYXBXpnjNc', '7vgbX3OljBI', 'NiVTom43ReQ', 'qrtKV_jNzrE'];
 const catalog = buildMediaCatalog([...ids.map((id, i) => release(i, { youtube_id: id, type: 'gard7' })), release(10, { youtube_id: 'dvLEsXrZXJ8', title: 'French book label' }), release(11, {title: 'English-looking title'})]);
 assert.equal(filterMediaCatalog(catalog, 'music', 'en', '').length, 14);
 assert.equal(filterMediaCatalog(catalog, 'all', 'de', '').length, 1);
 assert.equal(filterMediaCatalog(catalog, 'all', 'unknown', '')[0].release.id, 11);
});

test('audiobooks follow music and chapter order; type and language filters combine', () => {
 const chapter = (id, number, type = 'audiobook') => release(id, { type, chapter_number: number, series_slug: 'hoerbuch-die-orte-die-uns-sahen' });
 const catalog = buildMediaCatalog([chapter(12, 12), chapter(2, 2, 'chapter_audio'), release(20), chapter(1, 1)]);
 assert.deepEqual(catalog.slice(-3).map(x => x.release.id), [1,2,12]);
 assert.equal(filterMediaCatalog(catalog, 'audiobook', 'de', '').length, 3);
 assert.equal(filterMediaCatalog(catalog, 'audiobook', 'en', '').length, 0);
});

test('search is case and accent insensitive and combines words across title and place', () => {
 const catalog = buildMediaCatalog([release(1, { title: 'Été am Meer', place_name: 'Rhódos' })]);
 assert.equal(filterMediaCatalog(catalog, 'all', 'all', '  ETE RHODOS  ').length, 1);
 assert.equal(filterMediaCatalog(catalog, 'all', 'all', 'no-matching-title').length, 0);
 assert.equal(filterMediaCatalog(catalog, 'all', 'all', '   ').length, catalog.length);
});

test('replacing a soundtrack or GARD 7 video retains its content language', () => {
 const catalog = buildMediaCatalog([
  release(48, {slug:'als-der-horizont-uns-wiedersah', series_slug:'the-greece-chapters', youtube_id:'elMGltCaFfM'}),
  release(64, {slug:'the-light-we-carry', youtube_id:'newVideo123'})
 ]);
 assert.equal(filterMediaCatalog(catalog, 'music', 'de', '')[0].release.id, 48);
 assert.ok(filterMediaCatalog(catalog, 'music', 'en', '').some(entry => entry.release.id === 64));
});

test('French audiobooks are available through the French content filter', () => {
 const entries=buildMediaCatalog([release(80,{type:'audiobook',series_slug:'livre-audio-les-lieux-qui-nous-ont-vus',youtube_id:'CdtL5RiTg8s'})]);
 assert.equal(filterMediaCatalog(entries,'audiobook','fr','').length,1);
 assert.equal(filterMediaCatalog(entries,'audiobook','de','').length,0);
});
