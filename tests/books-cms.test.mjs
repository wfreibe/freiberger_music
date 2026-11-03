import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';
import { fileURLToPath } from 'node:url';

const result = await build({ entryPoints: [fileURLToPath(new URL('../frontend/src/data/books.ts', import.meta.url))], bundle: true, platform: 'node', format: 'esm', write: false });
const { bookMenu, findBook, bookMedia } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
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
