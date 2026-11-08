import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';

test('CMS migration, secure authentication and music CRUD with isolated synthetic data', async t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'music-cms-'));
  const db = path.join(temp, 'content.sqlite');
  const config = path.join(temp, 'config.php');
  fs.writeFileSync(config, `<?php return ['db_path'=>getenv('CMS_DB_PATH'),'backup_dir'=>getenv('CMS_BACKUP_DIR'),'session_save_path'=>__DIR__.'/sessions','upload_dir'=>__DIR__.'/uploads','cookie_secure'=>false];`);
  const env = { ...process.env, CMS_DB_PATH: db, CMS_BACKUP_DIR: path.join(temp, 'backups'), CMS_CONFIG_PATH: config };
  const php = (args, input) => {
    const result = spawnSync('php', args, { env, input, encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr || result.stdout); return result.stdout;
  };
  let server;
  t.after(async () => { if (server) { server.kill(); await new Promise(resolve => server.once('exit', resolve)); } fs.rmSync(temp, { recursive: true, force: true }); });
  php(['tests/cms-fixture.php']);
  assert.match(php(['bin/migrate.php']), /integrity_check=ok/);
  const backups = fs.readdirSync(env.CMS_BACKUP_DIR).length;
  php(['bin/migrate.php']);
  assert.equal(fs.readdirSync(env.CMS_BACKUP_DIR).length, backups, 'idempotent migration creates no redundant backup');
  const password = 'Synthetic-test-credential-123';
  // This credential exists only in the temporary synthetic test database.
  php(['-r', `require 'lib/Database.php'; $db=Database::getConnection(); $db->prepare('INSERT INTO admin_credentials(id,username,password_hash,must_change_password,credential_version) VALUES(1,?,?,1,1)')->execute(['admin',password_hash('${password}',PASSWORD_DEFAULT)]);`]);
  const listener = net.createServer(); await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve)); const port = listener.address().port; await new Promise(resolve => listener.close(resolve));
  let docroot = '.', router = 'scripts/dev-router.php';
  if (process.env.MUSIC_TEST_PACKAGE) {
    const installed = path.join(temp, 'installed'); fs.mkdirSync(installed);
    php(['-r', '$z=new ZipArchive(); if($z->open($argv[1])!==true || !$z->extractTo($argv[2])) exit(1);', process.env.MUSIC_TEST_PACKAGE, installed]);
    docroot = path.join(installed, 'webroot'); router = path.join(temp, 'router.php');
    fs.writeFileSync(router, `<?php $p=parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); if(str_starts_with($p,'/api/')) {require ${JSON.stringify(docroot.replaceAll('\\','/') + '/api/index.php')}; return;} if(is_file(${JSON.stringify(docroot.replaceAll('\\','/'))}.$p)) return false; require ${JSON.stringify(docroot.replaceAll('\\','/') + '/index.php')};`);
  }
  server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', docroot, router], { env, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  let serverError = ''; server.stderr.on('data', chunk => { serverError += chunk; });
  const base = `http://127.0.0.1:${port}/api`;
  let listening = false;
  for (let i = 0; i < 50; i++) { try { const r = await fetch(`${base}/ready`); if (r.ok) { listening = true; break; } } catch {} await new Promise(resolve => setTimeout(resolve, 100)); }
  assert.ok(listening, `Local synthetic test server unavailable: ${serverError}`);
  let cookie = '', csrf = '';
  async function request(route, method = 'GET', body, expected = 200, token = csrf) {
    const response = await fetch(`${base}/${route}`, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie, 'X-CSRF-Token': token }, body: body === undefined ? undefined : JSON.stringify(body) });
    const cookies = response.headers.getSetCookie();
    for (const item of cookies) if (!item.includes('Max-Age=0') && !item.includes('expires=Thu, 01 Jan 1970') && !item.split(';')[0].endsWith('=')) cookie = item.split(';')[0];
    const data = await response.json(); assert.equal(response.status, expected, JSON.stringify(data));
    if (data.csrf_token) csrf = data.csrf_token;
    return { data, response };
  }
  const publicRead = await request('releases'); assert.equal(publicRead.data.length, 13); assert.equal(publicRead.response.headers.get('set-cookie'), null);
  await request('releases', 'POST', {}, 405);
  await request('cms/releases', 'GET', undefined, 401);
  await request('cms/preview/books/1', 'GET', undefined, 401);
  const session = await request('cms/session'); assert.equal(session.data.authenticated, false); assert.match(session.response.headers.get('set-cookie'), /HttpOnly/i); assert.match(session.response.headers.get('set-cookie'), /SameSite=Strict/i);
  await request('cms/login', 'POST', { username: 'admin', password }, 403, 'wrong');
  await request('cms/login', 'POST', { username: 'admin', password: 'invalid' }, 401);
  const login = await request('cms/login', 'POST', { username: 'admin', password }); assert.equal(login.data.passwordChangeRequired, true);
  await request('cms/releases', 'GET', undefined, 403);
  await request('cms/password', 'POST', { password: 'short', confirmation: 'short' }, 400);
  await request('cms/password', 'POST', { password: 'New-synthetic-credential-123', confirmation: 'New-synthetic-credential-123' });
  const list = await request('cms/releases'); assert.equal(list.data.items.length, 13);
  let row = list.data.items.find(row => row.item.id === 1);
  await request('cms/releases/1', 'PUT', { item: { title: 'Edited Song' }, revision: row.revision }, 403, 'wrong');
  await request('cms/releases/1', 'PUT', { item: { place_id: 999 }, revision: row.revision }, 400);
  await request('cms/releases/1', 'PUT', { item: { cover: 'javascript:alert(1)' }, revision: row.revision }, 400);
  await request('cms/releases/1', 'PUT', { item: { invented: 'field' }, revision: row.revision }, 400);
  const updated = await request('cms/releases/1', 'PUT', { item: { title: 'Edited Song', place_id: 1, youtube_id: 'https://youtu.be/dvLEsXrZXJ8' }, revision: row.revision });
  assert.equal(updated.data.item.youtube_id, 'dvLEsXrZXJ8');
  const imageResult = spawnSync('php', ['-r', '$i=imagecreatetruecolor(2,2); imagepng($i); imagedestroy($i);'], { env, windowsHide: true });
  assert.equal(imageResult.status, 0);
  const form = new FormData(); form.set('image', new Blob([imageResult.stdout], { type: 'image/png' }), 'test.png');
  const upload = await fetch(`${base}/cms/upload`, { method: 'POST', headers: { Cookie: cookie, 'X-CSRF-Token': csrf }, body: form });
  assert.equal(upload.status, 201); const media = await upload.json(); assert.match(media.url, /^\/api\/media\/[a-f0-9]{48}\.webp$/);
  const imageResponse = await fetch(`http://127.0.0.1:${port}${media.url}`); assert.equal(imageResponse.status, 200); assert.equal(imageResponse.headers.get('Content-Type'), 'image/webp'); assert.equal(imageResponse.headers.get('set-cookie'), null);
  assert.equal((await fetch(`${base}/media/invalid`)).status, 404);
  await request('cms/releases/1', 'PUT', { item: { title: 'Stale' }, revision: row.revision }, 409);
  const place = (await request('cms/places')).data.items[0];
  await request('cms/places/1', 'DELETE', { revision: place.revision }, 409);
  const created = await request('cms/series', 'POST', { item: { slug: 'new-series', title: 'New Series' } }, 201);
  await request(`cms/series/${created.data.item.id}`, 'DELETE', { revision: created.data.revision });
  for (const area of ['places', 'books', 'chapters', 'series']) assert.ok((await request(`cms/${area}`)).data.fields.length);
  const bookList = (await request('cms/books')).data;
  assert.deepEqual(bookList.fields.slice(0, 7).map(field => field.name), ['language','title','menu_label','sort_order','show_in_navigation','is_published','slug']);
  const scarf = bookList.items.filter(row => ['der-rote-schal','l-echarpe-rouge','the-red-scarf'].includes(row.item.slug));
  assert.equal(scarf.length, 3);
  assert.deepEqual(scarf.map(row => row.item.language).sort(), ['de','en','fr']);
  for (const {item} of scarf) {
    assert.equal(item.songs_playlist_url, 'https://www.youtube.com/playlist?list=PLZZxqjAKPSZo');
    assert.equal(item.audiobook_playlist_url, 'https://www.youtube.com/playlist?list=PLP8djEaASfxE');
    assert.equal(item.film_youtube_id, 'rnweaIuC_-Y');
    assert.equal(item.film_duration, '4:27');
    assert.match(item.film_title, /Hohenlinden 1800/);
    assert.equal(item.film_url, 'https://www.youtube.com/playlist?list=PLefRR8TMnDiU');
    assert.equal(item.purchase_url, 'https://www.epubli.com/?s=Werner+Freiberger');
  }
  const allMedia = (await request('releases')).data;
  for (const {item} of scarf) {
    assert.equal(allMedia.filter(track => track.series_id === item.soundtrack_series_id).length, 7);
    const chapters = allMedia.filter(track => track.series_id === item.audiobook_series_id);
    assert.equal(chapters.length, 5);
    assert.deepEqual(chapters.map(track => track.chapter_number).sort((a,b) => a-b), [1,2,3,4,5]);
  }
  await request(`cms/books/${scarf[0].item.id}`, 'PUT', {item:{film_url:'javascript:alert(1)'},revision:scarf[0].revision},400);
  const enBook = bookList.items.find(row => row.item.slug === 'the-places-that-saw-us');
  const frBook = bookList.items.find(row => row.item.slug === 'les-lieux-qui-nous-ont-vus');
  assert.equal(enBook.item.language, 'en'); assert.equal(frBook.item.language, 'fr');
  await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { language: 'es' }, revision: enBook.revision }, 400);
  await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { is_published: 2 }, revision: enBook.revision }, 400);
  await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { sort_order: -1 }, revision: enBook.revision }, 400);
  await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { slug: 'places' }, revision: enBook.revision }, 400);
  const editedBook = (await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { title: 'Edited English Book', description: 'Description from CMS', menu_label: 'EN menu', sort_order: 1, show_in_navigation: 0 }, revision: enBook.revision })).data;
  const publicBook = (await request('books/the-places-that-saw-us')).data;
  assert.equal(publicBook.title, 'Edited English Book'); assert.equal(publicBook.show_in_navigation, 0);
  const publishedBooks = (await request('books')).data;
  assert.equal(publishedBooks[0].menu_label, 'EN menu', 'Public API respects CMS order.');
  php(['bin/migrate.php']);
  assert.equal((await request('books/the-places-that-saw-us')).data.description, 'Description from CMS', 'Repeated migration preserves CMS edits.');
  if (process.env.MUSIC_TEST_PACKAGE) {
    const html = await fetch(`http://127.0.0.1:${port}/the-places-that-saw-us`); assert.equal(html.status, 200); assert.match(await html.text(), /Edited English Book/);
  }
  await request(`cms/books/${enBook.item.id}`, 'PUT', { item: {film_youtube_id:'https://example.com/watch?v=rnweaIuC_-Y'}, revision:editedBook.revision },400);
  const withFilm = (await request(`cms/books/${enBook.item.id}`, 'PUT', {item:{film_youtube_id:'https://youtu.be/rnweaIuC_-Y'},revision:editedBook.revision})).data;
  assert.equal(withFilm.item.film_youtube_id,'rnweaIuC_-Y');
  await request('cms/preview/unknown/1', 'GET', undefined, 404);
  await request('cms/preview/books/999999', 'GET', undefined, 404);
  const draft = (await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { is_published: 0 }, revision: withFilm.revision })).data;
  const preview = await request(`cms/preview/books/${enBook.item.id}`);
  assert.equal(preview.data.item.title, 'Edited English Book');
  assert.equal(preview.data.item.is_published, 0);
  assert.match(preview.response.headers.get('cache-control'), /(?:^|,\s*)no-store(?:,|$)/);
  await request('books/the-places-that-saw-us', 'GET', undefined, 404);
  assert.ok(!(await request('books')).data.some(row => row.id === enBook.item.id));
  assert.ok((await request('cms/books')).data.items.some(row => row.item.id === enBook.item.id), 'Draft remains editable in CMS.');
  if (process.env.MUSIC_TEST_PACKAGE) {
    const html = await fetch(`http://127.0.0.1:${port}/the-places-that-saw-us`); assert.equal(html.status, 404); assert.ok(!(await html.text()).includes('Edited English Book'));
  }
  await request(`cms/books/${enBook.item.id}`, 'PUT', { item: { is_published: 1, slug: 'custom-english-book' }, revision: draft.revision });
  assert.equal((await request('books/custom-english-book')).data.language, 'en');
  const savedTitle = (await request('books/custom-english-book')).data.title;
  await request('cms/preview', 'POST', {area:'books',id:enBook.item.id,item:{title:'Unsaved preview'}},403,'wrong');
  const unsaved = await request('cms/preview', 'POST', {area:'books',id:enBook.item.id,item:{title:'Unsaved preview'}});
  assert.equal(unsaved.data.item.title,'Unsaved preview');
  assert.equal((await request('books/custom-english-book')).data.title,savedTitle,'Preview never saves');
  const blocks=[{id:'text-1',type:'text',enabled:true,data:{title:'Intro',html:'<p onclick="bad()">Allowed <strong>bold</strong><script>alert(1)</script><a href="javascript:alert(1)">link</a></p>'}},{id:'hidden',type:'text',enabled:false,data:{html:'PRIVATE-BLOCK-TEXT'}},{id:'old',type:'legacy',enabled:true,data:{}}];
  const page=(await request('cms/pages','POST',{item:{title:'Müller & Söhne',description:'Preserved original description',language:'de',is_published:1,show_in_navigation:1,content_blocks:JSON.stringify(blocks)}},201)).data;
  assert.equal(page.item.slug,'mueller-soehne');
  const published=(await request('pages/mueller-soehne')).data;
  assert.deepEqual(published.content_blocks.map(b=>b.id),['text-1','old']);
  assert.ok(published.content_blocks[0].data.html.includes('<strong>bold</strong>'));
  assert.doesNotMatch(JSON.stringify(published),/onclick|<script|javascript:|PRIVATE-BLOCK-TEXT/);
  const child=(await request('cms/pages','POST',{item:{title:'Child',slug:'child-page',language:'de',parent_id:page.item.id}},201)).data;
  await request(`cms/pages/${page.item.id}`,'PUT',{item:{language:'fr'},revision:page.revision},400);
  await request(`cms/pages/${page.item.id}`,'PUT',{item:{parent_id:child.item.id},revision:page.revision},400);
  await request(`cms/pages/${child.item.id}`,'PUT',{item:{language:'fr'},revision:child.revision},400);
  await request('cms/pages','POST',{item:{title:'Reserved',slug:'cms'}},400);
  for (const block of [
    {id:'image',type:'image',enabled:true,data:{src:'/covers/test.svg',html:'<p>Image copy</p>',options:{format:'16:9',layout:'beside',align:'right',width:75,focus_x:30,focus_y:50}}},
    {id:'slides',type:'slideshow',enabled:true,data:{interval:3,images:[{src:'/covers/test.svg',title:'Slide',caption:'Caption'}]}},
    {id:'accordion',type:'accordion',enabled:true,data:{items:[{id:'topic',title:'Topic',html:'<p>Answer</p>',enabled:true}]}},
    {id:'video',type:'youtube',enabled:true,data:{video:'https://youtu.be/rnweaIuC_-Y'}},
    {id:'audio',type:'audio',enabled:true,data:{src:'/files/test.mp3'}},
    {id:'link',type:'link',enabled:true,data:{href:'https://example.com/book',label:'Read'}}
  ]) {
    const checked=await request('cms/preview','POST',{area:'pages',id:page.item.id,item:{content_blocks:JSON.stringify([block])}});
    assert.equal(JSON.parse(checked.data.item.content_blocks)[0].type,block.type);
  }
  assert.equal((await request('cms/preview/pages/'+page.item.id)).data.item.content_blocks,page.item.content_blocks,'Module previews never save');
  const badBlocks=[{id:'bad',type:'youtube',enabled:true,data:{video:'https://evil.example/embed/foo'}}];
  await request(`cms/pages/${page.item.id}`,'PUT',{item:{content_blocks:JSON.stringify(badBlocks)},revision:page.revision},400);
  const renamed=(await request(`cms/pages/${page.item.id}`,'PUT',{item:{slug:'renamed-page'},revision:page.revision})).data;
  assert.equal(renamed.item.content_blocks,page.item.content_blocks,'Partial updates preserve blocks');
  await request('cms/pages','POST',{item:{title:'Reuse',slug:'mueller-soehne'}},400);
  if(process.env.MUSIC_TEST_PACKAGE){
    const old=await fetch(`http://127.0.0.1:${port}/mueller-soehne`,{redirect:'manual'});assert.equal(old.status,301);assert.equal(old.headers.get('location'),'/renamed-page');
    const html=await fetch(`http://127.0.0.1:${port}/renamed-page`);assert.equal(html.status,200);assert.match(await html.text(),/Müller/);
  }
  const cleared=(await request(`cms/pages/${page.item.id}`,'PUT',{item:{content_blocks:'[]'},revision:renamed.revision})).data;
  assert.deepEqual((await request('pages/renamed-page')).data.content_blocks,[]);
  assert.equal(cleared.item.description,'Preserved original description');
  assert.equal((await request('pages/renamed-page')).data.description,null);
  if(process.env.MUSIC_TEST_PACKAGE){const hiddenHtml=await fetch(`http://127.0.0.1:${port}/renamed-page`);assert.doesNotMatch(await hiddenHtml.text(),/Preserved original description/);}
  await request('cms/preview','POST',{area:'admin_credentials',item:{}},400);
  await request('cms/logout', 'POST', {});
  await request('cms/releases', 'GET', undefined, 401);
  await request('cms/preview/books/1', 'GET', undefined, 401);
  await request('cms/session');
  for (let i = 0; i < 5; i++) await request('cms/login', 'POST', { username: 'admin', password: 'incorrect' }, 401);
  await request('cms/login', 'POST', { username: 'admin', password: 'incorrect' }, 429);
  php(['bin/backup.php', '--check']);
});
