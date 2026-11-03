import { effect, signal } from '@preact/signals';
import { frenchTranslations } from './fr';
import { getCleanPath } from '../router';

export type Language = 'de' | 'en' | 'fr';

export function getBookLanguage(path: string): Language | undefined {
  switch (getCleanPath(path)) {
    case '/die-orte-die-uns-sahen':
    case '/die-orte-die-mich-sahen': return 'de';
    case '/the-places-that-saw-us': return 'en';
    case '/les-lieux-qui-nous-ont-vus': return 'fr';
    default: return undefined;
  }
}

function getInitialLanguage(): Language {
  const bookLanguage = getBookLanguage(getCleanPath());
  if (bookLanguage) return bookLanguage;
  try {
    const saved = localStorage.getItem('freiberger_lang');
    if (saved === 'de' || saved === 'en' || saved === 'fr') return saved;
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('fr')) return 'fr';
    // Default to German, but if browser is primarily English, we can respect that
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('en')) {
      return 'en';
    }
  } catch (e) {
    // localStorage might be unavailable in private mode
  }
  return 'de';
}

export const currentLang = signal<Language>(getInitialLanguage());

effect(() => {
  const lang = currentLang.value;
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
});

export function setLanguage(lang: Language): void {
  currentLang.value = lang;
  try {
    localStorage.setItem('freiberger_lang', lang);
  } catch (e) {}
}

// React only to route changes. A manual language choice on the current page stays active.
effect(() => {
  const bookLanguage = getBookLanguage(getCleanPath());
  if (bookLanguage) setLanguage(bookLanguage);
});

export const translations = {
  fr: frenchTranslations,
  de: {
    // Header & Nav
    brand_tagline: 'music · stories · places · memories',
    nav_archive: 'Musik',
    nav_places: 'Orte',
    nav_book: 'Die Orte, die uns sahen',
    nav_gard7: 'GARD 7',
    nav_studio: 'Studio ↗',

    // GARD 7 Section
    gard7_super: 'KÜNSTLER & PRODUKTIONEN',
    gard7_tagline: 'Die Songs, Beats und audiovisuellen Produktionen von GARD 7. Ein eigener Kosmos aus modernen elektronischen Klangwelten und Videos.',
    gard7_play_all: 'Alle Videos abspielen',
    gard7_view_youtube: 'Playlist auf YouTube ansehen',
    gard7_videos_title: 'SONG-VIDEOS & TRACKS',
    gard7_tracks_count: 'VIDEOS',
    gard7_videos_subtitle: 'Offizielle Musikvideos und Produktionen von GARD 7',

    // Hero
    hero_super: 'Audiovisuelles Archiv · Griechenland',
    hero_tagline: 'MUSIC FROM PLACES THAT REMEMBER · Ein audiovisuelles Archiv aus Klanglandschaften, Erinnerung und Ägäis.',
    hero_featured_label: 'NOW PLAYING · AKTUELLER SCHWERPUNKT',
    hero_btn_play: 'Anhören ▶',
    hero_btn_details: 'Notizen & Video ↑',

    // Slider
    slider_super: 'Audiovisuelle Veröffentlichungen',
    slider_title: 'DIE 10 SOUNDTRACK-SONGS',
    slider_subtitle: 'Komponiert und produziert von FREIBERGER für die Schauplätze in Griechenland',

    // Home Page
    home_loading: 'Archiv wird geladen...',
    home_slider_title: 'OFFIZIELLER SOUNDTRACK',
    home_slider_subtitle: 'Die 10 Titel zu den Schauplätzen in Griechenland',

    // Book Section on Home
    book_super: 'Das Buch & Begleitprojekt',
    book_open_page: 'Buchseite & Hörbuch öffnen ↗',
    book_tab_songs: '♫ SONGS',
    book_tab_audiobook: '📖 HÖRBUCH',
    book_listen: 'Anhören ▶',

    // Book Page
    book_page_super: 'Begleitendes Audiouniversum zum Buch',
    book_welcome_hint: 'Herzlich willkommen über den Link aus dem gedruckten Buch! Hier findest du die eigenständigen musikalischen Stücke zu jedem Ort sowie das vollständige Hörbuch.',
    book_tab_songs_main: '♫ DIE SONGS',
    book_tab_songs_sub: 'Soundtrack',
    book_tab_audiobook_main: '📖 DAS HÖRBUCH',
    book_tab_audiobook_sub: 'Lesungen',
    book_tab_songs_btn: '♫ DIE SONGS (SOUNDTRACK)',
    book_tab_audiobook_btn: '📖 DAS HÖRBUCH (LESUNGEN)',
    book_songs_badge: 'TITEL',
    book_audiobook_badge: 'KAPITEL',
    book_songs_intro: 'Die musikalischen Stücke zum Buch · Komponiert von FREIBERGER',
    book_audiobook_intro: 'Das vollständige Hörbuch · 11 Kapitel und Epilog',
    book_loading: 'Buch & Klangwelten werden geladen...',
    view_grid: '⊞ Karten',
    view_list: '☰ Liste',

    // Releases & Cards
    play_label: 'Abspielen ▶',
    listen_label: 'Anhören',
    default_place: 'Griechenland',

    // Places Page
    places_loading: 'Schauplatz wird geladen...',
    places_super: 'Geografie der Klänge',
    places_title: 'SCHAUPLÄTZE',
    places_subtitle: 'Orte in Griechenland, die zu Musik und Kapiteln wurden',
    places_grid_subline: 'Acht Schauplätze in Griechenland. Jede Insel und jede Stadt trägt ein eigenes klangliches Archiv aus Wind, Stein und Meer.',
    places_back_all: '← Alle Schauplätze',
    places_music_from: 'Musik aus',
    places_chapters_at: 'Buchkapitel an diesem Ort',
    places_view_in_book: 'Im Buch ansehen →',
    places_explore: 'Erkunden →',
    places_works: 'Werke',

    // Interactive Map
    map_title: 'INTERAKTIVE ÄGÄIS-KARTE',
    map_subtitle: 'Klicke auf einen Schauplatz, um seinen Soundtrack anzuhören',
    map_hover_hint: 'Schauplatz wählen',
    map_play_song: 'Song abspielen ▶',
    map_explore_place: 'Ort erkunden →',

    // Player Bar
    player_play: 'Abspielen',
    player_pause: 'Pause',
    player_next: 'Nächster Titel',
    player_prev: 'Vorheriger Titel',
    player_ambient_on: '🌊 Ägäis Ambient: AN',
    player_ambient_off: '🌊 Ägäis Ambient',
    player_details: 'Details / Video ↑',
    player_close: 'Schließen ✕',
    player_watch_youtube: 'Auf YouTube ↗',

    // Player Drawer
    drawer_archive_label: 'Audiovisuelles Archiv',
    drawer_tempo: 'Tempo',
    drawer_duration: 'Dauer',
    drawer_place: 'Schauplatz',
    drawer_chapter: 'Buchkapitel',
    drawer_tab_story: 'Hintergrund & Geschichte',
    drawer_tab_lyrics: 'Liedtext',
    drawer_tab_notes: 'Buch-Bezug',
    drawer_two_click_hint: 'Datenschutz: Erst beim Start wird die YouTube-Verbindung hergestellt.',
    drawer_read_chapter: 'Kapitel im Buch ansehen ↗',

    // Footer & Legal
    footer_copyright: '© 2026 Werner Freiberger · freiberger.music',
    footer_tagline: 'Ein audiovisuelles Archiv aus Klanglandschaften, Erinnerung und Ägäis.',
    footer_privacy_badge: '100% werbe- und trackingfrei · Keine Marketing-Cookies',
    footer_link_archive: 'Musik',
    footer_link_places: 'Orte',
    footer_link_book: 'Die Orte, die uns sahen',
    footer_link_legal: 'Impressum & Datenschutz',
    legal_title: 'IMPRESSUM & DATENSCHUTZ',
    legal_subtitle: 'Rechtliche Angaben gemäß § 5 DDG, Urheberrecht und transparente Datenschutzerklärung nach DSGVO & TDDDG.',
    legal_tab_imprint: 'Impressum (§ 5 DDG)',
    legal_tab_privacy: 'Datenschutz (DSGVO)',
    playing_label: 'Spielt',
    audiobook_reading_tag: 'Hörbuch · Lesung',
    gard7_official_video: 'GARD 7 · Offizielles Video',
    youtube_load_stream: 'Audiovisuellen Stream laden',
    youtube_privacy_notice: '2-Click Datenschutz: Mit Klick wird der externe Player von youtube-nocookie.com aktiviert.',
    legal_header_super: 'RECHTLICHE HINWEISE & TRANSPARENZ',
    legal_back_archive: 'Zurück zur Musik',
    legal_disclaimer: 'Hinweis: Maßgeblich für rechtliche Fragen ist die deutsche Fassung.',
    music_label: 'Musik',
    chapters_label: 'Kapitel'
  },
  en: {
    // Header & Nav
    brand_tagline: 'music · stories · places · memories',
    nav_archive: 'Music',
    nav_places: 'Locations',
    nav_book: 'Die Orte, die uns sahen',
    nav_gard7: 'GARD 7',
    nav_studio: 'Studio ↗',

    // GARD 7 Section
    gard7_super: 'ARTIST & PRODUCTIONS',
    gard7_tagline: 'Song videos, beats, and audiovisual productions by GARD 7. A distinct universe of modern electronic soundscapes and videos.',
    gard7_play_all: 'Play All Videos',
    gard7_view_youtube: 'View Playlist on YouTube',
    gard7_videos_title: 'SONG VIDEOS & TRACKS',
    gard7_tracks_count: 'VIDEOS',
    gard7_videos_subtitle: 'Official music videos and productions by GARD 7',

    // Hero
    hero_super: 'Audiovisual Archive · Greece',
    hero_tagline: 'MUSIC FROM PLACES THAT REMEMBER · An audiovisual archive of soundscapes, memory, and the Aegean.',
    hero_featured_label: 'NOW PLAYING · FEATURED FOCUS',
    hero_btn_play: 'Listen ▶',
    hero_btn_details: 'Notes & Video ↑',

    // Slider
    slider_super: 'Audiovisual Releases',
    slider_title: 'THE 10 SOUNDTRACK SONGS',
    slider_subtitle: 'Composed and produced by FREIBERGER for locations across Greece',

    // Home Page
    home_loading: 'Loading archive...',
    home_slider_title: 'OFFICIAL SOUNDTRACK',
    home_slider_subtitle: 'The 10 tracks composed for the locations across Greece',

    // Book Section on Home
    book_super: 'The Printed Book & Audio Universe',
    book_open_page: 'Open Book & Audiobook Page ↗',
    book_tab_songs: '♫ SONGS',
    book_tab_audiobook: '📖 AUDIOBOOK',
    book_listen: 'Listen ▶',

    // Book Page
    book_page_super: 'Accompanying Audio Universe for the Book',
    book_welcome_hint: 'Welcome via the link from the printed book! Here you will find the standalone musical pieces for each location as well as the complete audiobook.',
    book_tab_songs_main: '♫ THE SONGS',
    book_tab_songs_sub: 'Soundtrack',
    book_tab_audiobook_main: '📖 THE AUDIOBOOK',
    book_tab_audiobook_sub: 'Readings',
    book_tab_songs_btn: '♫ THE SONGS (SOUNDTRACK)',
    book_tab_audiobook_btn: '📖 THE AUDIOBOOK (READINGS)',
    book_songs_badge: 'TRACKS',
    book_audiobook_badge: 'CHAPTERS',
    book_songs_intro: 'The musical pieces for the book · Composed by FREIBERGER',
    book_audiobook_intro: 'The complete audiobook · 11 chapters and epilogue',
    book_loading: 'Loading book & soundscapes...',
    view_grid: '⊞ Cards',
    view_list: '☰ List',

    // Releases & Cards
    play_label: 'Play ▶',
    listen_label: 'Listen',
    default_place: 'Greece',

    // Places Page
    places_loading: 'Loading location...',
    places_super: 'Geography of Sound',
    places_title: 'LOCATIONS',
    places_subtitle: 'Places in Greece that turned into music and story chapters',
    places_grid_subline: 'Eight locations across Greece. Every island and city carries its own sonic archive of wind, stone, and the sea.',
    places_back_all: '← All Locations',
    places_music_from: 'Music from',
    places_chapters_at: 'Book chapters at this location',
    places_view_in_book: 'View in book →',
    places_explore: 'Explore →',
    places_works: 'works',

    // Interactive Map
    map_title: 'INTERACTIVE AEGEAN MAP',
    map_subtitle: 'Click a location to listen to its soundtrack',
    map_hover_hint: 'Select location',
    map_play_song: 'Play Song ▶',
    map_explore_place: 'Explore Location →',

    // Player Bar
    player_play: 'Play',
    player_pause: 'Pause',
    player_next: 'Next Track',
    player_prev: 'Previous Track',
    player_ambient_on: '🌊 Aegean Ambient: ON',
    player_ambient_off: '🌊 Aegean Ambient',
    player_details: 'Details / Video ↑',
    player_close: 'Close ✕',
    player_watch_youtube: 'On YouTube ↗',

    // Player Drawer
    drawer_archive_label: 'Audiovisual Archive',
    drawer_tempo: 'Tempo',
    drawer_duration: 'Duration',
    drawer_place: 'Location',
    drawer_chapter: 'Book Chapter',
    drawer_tab_story: 'Background & Story',
    drawer_tab_lyrics: 'Lyrics',
    drawer_tab_notes: 'Book Reference',
    drawer_two_click_hint: 'Privacy: YouTube connection is only established upon playback.',
    drawer_read_chapter: 'View chapter in book ↗',

    // Footer & Legal
    footer_copyright: '© 2026 Werner Freiberger · freiberger.music',
    footer_tagline: 'An audiovisual archive of places, music and memory.',
    footer_privacy_badge: '100% ad- and tracking-free · No marketing cookies',
    footer_link_archive: 'Music',
    footer_link_places: 'Places',
    footer_link_book: 'The Places That Saw Us',
    footer_link_legal: 'Imprint & Privacy Policy',
    legal_title: 'LEGAL NOTICE & PRIVACY',
    legal_subtitle: 'Information pursuant to § 5 DDG, copyright information and GDPR & TDDDG privacy policy.',
    legal_tab_imprint: 'Imprint (§ 5 DDG)',
    legal_tab_privacy: 'Privacy Policy (GDPR)',
    playing_label: 'Playing',
    audiobook_reading_tag: 'Audiobook · Reading',
    gard7_official_video: 'GARD 7 · Official Video',
    youtube_load_stream: 'Load audiovisual stream',
    youtube_privacy_notice: '2-Click Privacy: Clicking activates the external player from youtube-nocookie.com.',
    legal_header_super: 'LEGAL NOTICE & TRANSPARENCY',
    legal_back_archive: 'Back to Music',
    legal_disclaimer: 'Note: In case of discrepancies or questions of interpretation, the German version shall prevail.',
    music_label: 'Music',
    chapters_label: 'Chapters'
  }
} as const;

export function t(key: keyof typeof translations.de): string {
  const lang = currentLang.value;
  return translations[lang]?.[key] || translations.de[key] || key;
}

export function translatePlaceName(name: string | null | undefined): string {
  if (!name) return '';
  const lang = currentLang.value;
  if (lang === 'fr') {
    const names: Record<string, string> = {
      ATHEN: 'Athènes', ATHENS: 'Athènes', KORFU: 'Corfou', CORFU: 'Corfou',
      KRETA: 'Crète', CRETE: 'Crète', RHODOS: 'Rhodes', RHODES: 'Rhodes',
      SANTORIN: 'Santorin', SANTORINI: 'Santorin', DELPHI: 'Delphes', OLYMP: 'Olympe',
      PELOPONNES: 'Péloponnèse', NAFPLIO: 'Nauplie', KORINTH: 'Corinthe',
      GRIECHENLAND: 'Grèce', GREECE: 'Grèce',
    };
    return names[name.toUpperCase()] || name;
  }
  if (lang === 'de') {
    const deMap: Record<string, string> = {
      'ATHENS': 'Athen',
      'CORFU': 'Korfu',
      'CRETE': 'Kreta',
      'RHODES': 'Rhodos',
      'GREECE': 'Griechenland'
    };
    return deMap[name.toUpperCase()] || name;
  }
  const enMap: Record<string, string> = {
    'ATHEN': 'Athens',
    'ATHENS': 'Athens',
    'KORFU': 'Corfu',
    'CORFU': 'Corfu',
    'KRETA': 'Crete',
    'CRETE': 'Crete',
    'RHODOS': 'Rhodes',
    'RHODES': 'Rhodes',
    'SANTORIN': 'Santorini',
    'SANTORINI': 'Santorini',
    'NAXOS': 'Naxos',
    'KOS': 'Kos',
    'DELPHI': 'Delphi',
    'OLYMP': 'Mount Olympus',
    'PELOPONNES': 'Peloponnese',
    'NAFPLIO': 'Nafplio',
    'KORINTH': 'Corinth',
    'GRIECHENLAND': 'Greece',
    'GREECE': 'Greece'
  };
  return enMap[name.toUpperCase()] || name;
}

export function translateSubtitle(subtitle: string | null | undefined): string {
  if (!subtitle) return '';
  if (currentLang.value === 'de') return subtitle;
  if (currentLang.value === 'fr') {
    return subtitle
      .replace(/Von Delos nach Delphi/g, 'De Délos à Delphes')
      .replace(/Eine Erinnerung an /g, 'Un souvenir de ')
      .replace(/Eine Reise durch /g, 'Un voyage à travers ')
      .replace(/Eine Reise nach /g, 'Un voyage vers ')
      .replace(/Eine Rückkehr nach /g, 'Un retour à ')
      .replace(/Between horizon and stone/g, 'Entre horizon et pierre')
      .replace(/Athen/g, 'Athènes').replace(/Kreta/g, 'Crète')
      .replace(/Korfu/g, 'Corfou').replace(/Rhodos/g, 'Rhodes')
      .replace(/Santorini/g, 'Santorin').replace(/Griechenland/g, 'Grèce');
  }

  const exactMap: Record<string, string> = {
    'Von Delos nach Delphi': 'From Delos to Delphi',
    'Eine Erinnerung an Zakynthos & Marathonisi': 'A Memory of Zakynthos & Marathonisi',
    'Eine Erinnerung an Korfu & Korkyra': 'A Memory of Corfu & Korkyra',
    'Eine Erinnerung an Athen': 'A Memory of Athens',
    'Eine Reise durch Kreta': 'A Journey Across Crete',
    'Eine Erinnerung an Santorini & Akrotiri': 'A Memory of Santorini & Akrotiri',
    'Eine Rückkehr nach Naxos': 'A Return to Naxos',
    'Eine Reise nach Rhodos & Helios': 'A Journey to Rhodes & Helios',
    'Eine Erinnerung an Kos & Nisyros': 'A Memory of Kos & Nisyros',
    'Between horizon and stone': 'Between horizon and stone',
    'Die Stadt über der Stadt – Eine Erinnerung an Athen': 'The City Above the City – A Memory of Athens',
    'Eine Erinnerung an den Areopag': 'A Memory of the Areopagus',
    'Die Geister von Knossos': 'The Ghosts of Knossos',
    'Salz und Zement': 'Salt and Cement'
  };

  if (exactMap[subtitle]) {
    return exactMap[subtitle];
  }

  return subtitle
    .replace(/Eine Erinnerung an /g, 'A Memory of ')
    .replace(/Eine Reise durch /g, 'A Journey Across ')
    .replace(/Eine Reise nach /g, 'A Journey to ')
    .replace(/Eine Rückkehr nach /g, 'A Return to ')
    .replace(/Von Delos nach Delphi/g, 'From Delos to Delphi')
    .replace(/Athen/g, 'Athens')
    .replace(/Kreta/g, 'Crete')
    .replace(/Korfu/g, 'Corfu')
    .replace(/Rhodos/g, 'Rhodes')
    .replace(/Santorin/g, 'Santorini')
    .replace(/Griechenland/g, 'Greece');
}
