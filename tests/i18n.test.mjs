import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';

test('English book routes accept the printed barcode and legacy alias', async () => {
  const result = await build({
    entryPoints: [fileURLToPath(new URL('../frontend/src/router.ts', import.meta.url))],
    bundle: true, format: 'esm', platform: 'node', write: false,
  });
  const { getCleanPath } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  for (const path of ['/the-places-that-saw-us', '/the-places-that-saw-us/', '/the_places_that_saw_us', '#/the_places_that_saw_us/']) {
    assert.equal(getCleanPath(path), '/the-places-that-saw-us');
  }
  assert.equal(getCleanPath('/les-lieux-qui-nous-ont-vus'), '/les-lieux-qui-nous-ont-vus');
});

test('French UI has all translation keys and persists the selected language', async () => {
  const saved = new Map([['freiberger_lang', 'fr']]);
  globalThis.localStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  globalThis.document = { documentElement: { lang: '' } };
  const result = await build({
    entryPoints: [fileURLToPath(new URL('../frontend/src/i18n/index.ts', import.meta.url))],
    bundle: true, format: 'esm', platform: 'node', write: false,
  });
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64');
  const i18n = await import(moduleUrl);
  assert.equal(i18n.currentLang.value, 'fr');
  assert.equal(document.documentElement.lang, 'fr');
  const keys = Object.keys(i18n.translations.de).sort();
  for (const lang of ['de', 'en', 'fr']) {
    assert.deepEqual(Object.keys(i18n.translations[lang]).sort(), keys);
    i18n.setLanguage(lang);
    assert.equal(saved.get('freiberger_lang'), lang);
    assert.equal(document.documentElement.lang, lang);
    for (const key of keys) assert.ok(i18n.t(key).trim(), `${lang}: ${key}`);
  }
  assert.equal(i18n.t('player_next'), 'Morceau suivant');
  assert.equal(i18n.translatePlaceName('ATHEN'), 'Athènes');
  assert.equal(i18n.translateSubtitle('Eine Erinnerung an Kreta'), 'Un souvenir de Crète');
  assert.equal(i18n.translatePlaceName(null), '');
  assert.equal(i18n.translateSubtitle(undefined), '');
});

test('Book edition text follows UI language without changing the edition', async () => {
  const result = await build({
    entryPoints: [fileURLToPath(new URL('../frontend/src/i18n/bookEdition.ts', import.meta.url))],
    bundle: true, format: 'esm', platform: 'node', write: false,
  });
  const { getBookEditionCopy } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  for (const edition of ['en', 'fr']) {
    const de = getBookEditionCopy(edition, 'de');
    const en = getBookEditionCopy(edition, 'en');
    const fr = getBookEditionCopy(edition, 'fr');
    assert.equal(de.title, en.title);
    assert.equal(en.title, fr.title);
    assert.equal(de.audiobook, 'Hörbuch');
    assert.equal(en.audiobook, 'Audiobook');
    assert.equal(fr.audiobook, 'Livre audio');
    assert.notEqual(de.welcome, en.welcome);
    assert.notEqual(en.welcome, fr.welcome);
  }
  assert.equal(getBookEditionCopy('fr', 'en').subtitle, 'Songs in German');
  assert.equal(getBookEditionCopy('en', 'fr').welcome, 'Bienvenue dans l’édition anglaise de');
});

test('Book links override saved language once while manual changes and the home page retain the choice', async () => {
  const saved = new Map([['freiberger_lang', 'de']]);
  globalThis.localStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  globalThis.document = { documentElement: { lang: '' } };
  globalThis.window = {
    location: { pathname: '/freiberger-music/les-lieux-qui-nous-ont-vus/', hash: '' },
    addEventListener() {},
  };
  try {
    const result = await build({
      stdin: {
        contents: "export * from './i18n/index'; export { currentRoute } from './router';",
        resolveDir: fileURLToPath(new URL('../frontend/src/', import.meta.url)),
      },
      bundle: true, format: 'esm', platform: 'node', write: false,
    });
    const module = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
    assert.equal(module.currentLang.value, 'fr');
    assert.equal(saved.get('freiberger_lang'), 'fr');
    module.setLanguage('de');
    assert.equal(module.currentLang.value, 'de');
    module.currentRoute.value = '/';
    assert.equal(module.currentLang.value, 'de');
    module.currentRoute.value = '/the_places_that_saw_us';
    assert.equal(module.currentLang.value, 'en');
    module.setLanguage('fr');
    assert.equal(module.currentLang.value, 'fr');
    module.currentRoute.value = '/die-orte-die-uns-sahen';
    assert.equal(module.currentLang.value, 'de');
    module.currentRoute.value = '/the-places-that-saw-us/';
    assert.equal(module.currentLang.value, 'en');
    module.currentRoute.value = '/';
    assert.equal(module.currentLang.value, 'en');
    assert.equal(module.getBookLanguage('#/les-lieux-qui-nous-ont-vus/'), 'fr');
    assert.equal(module.getBookLanguage('/places'), undefined);
  } finally {
    delete globalThis.window;
  }
});
