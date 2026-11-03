import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';
const result = await build({entryPoints:['frontend/src/data/bookAudiobooks.ts'],bundle:true,format:'esm',platform:'node',write:false});
const {getBookAudiobooks} = await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const manifest=JSON.parse(readFileSync(new URL('../scripts/audiobook-playlists.json',import.meta.url),'utf8'));
const releases=['de','fr'].flatMap(lang=>manifest[lang].videos.map(v=>({id:`${lang}-${v.chapter}`,type:'audiobook',series_slug:lang==='de'?'hoerbuch-die-orte-die-uns-sahen':'livre-audio-les-lieux-qui-nous-ont-vus',youtube_id:v.id,sort_order:(lang==='de'?100:200)+v.chapter})));
test('German and French book audiobooks remain separate and follow chapter order',()=>{
 for (const lang of ['de','fr']) {
  const list=getBookAudiobooks([...releases].reverse(),lang);
  assert.equal(list.length,12);
  assert.deepEqual(list.map(x=>x.youtube_id),manifest[lang].videos.map(x=>x.id));
 }
});
test('playlist manifests contain 12 unique, playable chapters each',()=>{
 for (const lang of ['de','fr']) {
  const list=manifest[lang].videos;
  assert.deepEqual(list.map(x=>x.chapter),Array.from({length:12},(_,i)=>i+1));
  assert.equal(new Set(list.map(x=>x.id)).size,12);
  for (const v of list) {assert.match(v.id,/^[\w-]{11}$/);assert.match(v.duration,/^\d+:\d{2}$/);}
 }
});
