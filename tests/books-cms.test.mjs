import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';
import { fileURLToPath } from 'node:url';

const result = await build({ entryPoints: [fileURLToPath(new URL('../frontend/src/data/books.ts', import.meta.url))], bundle: true, platform: 'node', format: 'esm', write: false });
const { bookMenu, findBook, bookMedia, redScarfMediaCopy, bookFilm } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
const book = (id, values = {}) => ({ id, slug: `book-${id}`, title: `Book ${id}`, language: 'de', is_published: 1, show_in_navigation: 1, sort_order: 10, soundtrack_source: 'series', ...values });

test('book menu follows CMS publication, navigation visibility and stable ordering', () => {
  const rows = [book(1, {sort_order: 30}), book(2, {sort_order: 5, menu_label: 'English edition'}), book(3, {show_in_navigation: 0}), book(4, {is_published: 0}), book(5, {sort_order: 5})];
  assert.deepEqual(bookMenu(rows).map(row => row.id), [2,5,1]);
  assert.equal(bookMenu(rows)[0].menu_label, 'English edition');
  assert.deepEqual(rows.map(row => row.id), [1,2,3,4,5], 'Sorting does not mutate shared CMS data.');
});

test('published books resolve their CMS URL, even when hidden from the menu', () => {
  const rows = [book(1, {slug: 'die-orte-die-uns-sahen'}), book(2, {slug: 'custom-english-book', language: 'en', show_in_navigation: 0}), book(3, {slug: 'draft', is_published: 0})];
  assert.equal(findBook(rows, '/custom-english-book')?.language, 'en');
  assert.equal(findBook(rows, '/die-orte-die-mich-sahen')?.id, 1);
  assert.equal(findBook(rows, '/draft'), undefined);
  assert.equal(findBook(rows, '/missing'), undefined);
});

test('book media use selected series and preserve the existing English soundtrack', () => {
  const rows = [{id:1,series_id:2,type:'song'}, {id:2,series_id:2,type:'single'}, {id:3,series_id:3,type:'song'}, {id:4,series_id:4,type:'audiobook',chapter_number:2}, {id:5,series_id:4,type:'chapter_audio',chapter_number:1}];
  const media = bookMedia(book(1, {soundtrack_series_id:2,audiobook_series_id:4}), rows);
  assert.deepEqual(media.songs.map(row => row.id), [1,2]); assert.deepEqual(media.audiobooks.map(row => row.id), [5,4]);
  assert.equal(bookMedia(book(2, {language:'en',soundtrack_source:'english_book'}), rows).songs.length, 10);
  assert.deepEqual(bookMedia(book(3), rows), {songs:[],audiobooks:[]});
});

test('Red Scarf recordings retain playlist order, video IDs and recording language labels', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../scripts/red-scarf-playlists.json', import.meta.url), 'utf8'));
  assert.equal(manifest.songs.videos.length, 7);
  assert.equal(manifest.audiobook.videos.length, 5);
  const tracks = ['songs','audiobook'].flatMap((kind, group) => manifest[kind].videos.map((video,index) => ({...video, id: group*100+index, youtube_id:video.id, type: group ? 'audiobook' : 'song', series_id: group+1, chapter_number: group ? index+1 : null})));
  const edition = book(1, {soundtrack_series_id:1,audiobook_series_id:2,songs_playlist_url:'https://www.youtube.com/playlist?list=PLZZxqjAKPSZo'});
  const media = bookMedia(edition,tracks);
  assert.deepEqual(media.songs.map(track => track.youtube_id),manifest.songs.videos.map(video => video.id));
  assert.deepEqual(media.audiobooks.map(track => track.youtube_id),manifest.audiobook.videos.map(video => video.id));
  assert.equal(new Set(tracks.map(track => track.youtube_id)).size,12);
  for (const track of tracks) assert.match(track.youtube_id,/^[A-Za-z0-9_-]{11}$/);
  assert.equal(redScarfMediaCopy(edition,'en').audiobook,'Audiobook in German');
  assert.equal(redScarfMediaCopy(edition,'fr').songs,'Chansons en français');
  assert.equal(redScarfMediaCopy(book(2),'de'),null);
});

test('book film uses a validated video and its own player identity', () => {
  const filmBook = book(4, {slug:'der-rote-schal', film_youtube_id:'rnweaIuC_-Y', film_title:'Verified film title', film_duration:'4:27'});
  const film = bookFilm(filmBook);
  assert.equal(film.youtube_id,'rnweaIuC_-Y');
  assert.equal(film.title,'Verified film title');
  assert.equal(film.duration,'4:27');
  assert.equal(film.type,'film');
  assert.ok(film.id < -1000000000);
  assert.notEqual(film.id,bookFilm({...filmBook,id:5}).id);
  assert.equal(film.series_title,filmBook.title);
  assert.equal(bookFilm(book(1)),null);
  assert.equal(bookFilm({...filmBook,film_youtube_id:'https://untrusted.example/video'}),null);
});

test('content module helpers reject unsafe media and preserve sorting inputs', async () => {
  const result=await build({entryPoints:[fileURLToPath(new URL('../frontend/src/utils/contentBlocks.js',import.meta.url))],bundle:true,platform:'node',format:'esm',write:false});
  const utils=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
  assert.equal(utils.youtubeId('https://youtu.be/rnweaIuC_-Y'),'rnweaIuC_-Y');
  assert.equal(utils.youtubeId('https://evil.example/watch?v=rnweaIuC_-Y'),'');
  assert.equal(utils.localImage('/api/media/'+ 'a'.repeat(48)+'.webp'),true);
  assert.equal(utils.localImage('//evil.example/a.jpg'),false);
  assert.equal(utils.localAudio('/files/test.mp3'),true);
  assert.equal(utils.localAudio('/files/%2e%2e/test.mp3'),false);
  assert.equal(utils.safeBlockLink('javascript:alert(1)'),'');
  assert.deepEqual(utils.pageBlocks(null),[{id:'existing-content',type:'legacy',enabled:true,data:{}}]);
  assert.deepEqual(utils.pageBlocks('[]'),[]);
  const before=[{id:'a'},{id:'b'}];assert.deepEqual(utils.moveBlock(before,1,0).map(b=>b.id),['b','a']);assert.equal(before[0].id,'a');
});
