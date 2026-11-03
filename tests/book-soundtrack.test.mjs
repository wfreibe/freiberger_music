import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';
const result = await build({entryPoints:[fileURLToPath(new URL('../frontend/src/data/bookSoundtrack.ts', import.meta.url))],bundle:true,format:'esm',platform:'node',write:false});
const { isBookSoundtrack } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));

test('book pages retain the edited Naxos song with the live legacy type and new video', () => {
 const release = {id:'48',slug:'als-der-horizont-uns-wiedersah',title:'Als der Horizont uns wiedersah',type:'single',youtube_id:'elMGltCaFfM',series_slug:'the-greece-chapters'};
 const songs = [release].filter(isBookSoundtrack);
 assert.equal(songs.length,1);
 assert.equal(songs[0].youtube_id,'elMGltCaFfM');
 assert.equal(songs[0].type,'single');
});

test('book soundtrack excludes unrelated singles, GARD 7 and audiobooks', () => {
 assert.equal(isBookSoundtrack({type:'song'}),true);
 for (const type of ['audiobook','chapter_audio','gard7','ep','album']) {
  assert.equal(isBookSoundtrack({type,series_slug:'the-greece-chapters'}),false);
 }
 assert.equal(isBookSoundtrack({type:'single',series_slug:'gard-7'}),false);
 assert.equal(isBookSoundtrack({type:'single'}),false);
});
