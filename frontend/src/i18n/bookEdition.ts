import type { Language } from './index';

export function getBookEditionCopy(edition: 'en' | 'fr', language: Language) {
  const french = edition === 'fr';
  const title = french ? 'LES LIEUX QUI NOUS ONT VUS' : 'THE PLACES THAT SAW US';
  const name = french ? 'Les lieux qui nous ont vus' : 'The Places That Saw Us';
  const copy = {
    de: {
      super: 'DAS BUCH · DIE MUSIK · DIE ORTE', book: 'BUCH', ebook: 'E-BOOK', soundtrack: 'Soundtrack',
      welcome: `Willkommen zur ${french ? 'französischen' : 'englischen'} Ausgabe von`,
      intro: french ? 'Hier findest du das französische Hörbuch und die deutschsprachigen Songs, die das Buch begleiten.' : 'Entdecke die Musik zum Buch und kehre zu den Orten hinter seinen Geschichten zurück.',
      chapters: 'Kapitel', songs: 'Titel', subtitle: french ? 'Deutschsprachige Songs' : 'Die Musik zum Buch', audiobook: 'Hörbuch',
      audiobookNote: `Das ${french ? 'französische' : 'englische'} Hörbuch erscheint demnächst.`,
      cards: 'Karten', list: 'Liste', play: 'Anhören', playing: 'Spielt',
      loading: 'Titel werden geladen…', unavailable: 'Die Titel können gerade nicht geladen werden.', retry: 'Erneut versuchen',
      playlist: 'Playlist auf YouTube öffnen ↗',
    },
    en: {
      super: 'THE BOOK · THE MUSIC · THE PLACES', book: 'BOOK', ebook: 'EBOOK', soundtrack: 'Soundtrack',
      welcome: `Welcome to the ${french ? 'French' : 'English'} edition of`,
      intro: french ? 'Listen to the French audiobook and the German-language songs that accompany the book.' : 'Follow the music that accompanies the book and return to the places behind its stories.',
      chapters: 'chapters', songs: 'songs', subtitle: french ? 'Songs in German' : 'The music from the book', audiobook: 'Audiobook',
      audiobookNote: `The ${french ? 'French' : 'English'} audiobook is on its way.`,
      cards: 'Cards', list: 'List', play: 'Play', playing: 'Playing',
      loading: 'Loading tracks…', unavailable: 'The tracks could not be loaded right now.', retry: 'Try again',
      playlist: 'Open playlist on YouTube ↗',
    },
    fr: {
      super: 'LE LIVRE · LA MUSIQUE · LES LIEUX', book: 'LIVRE', ebook: 'LIVRE NUMÉRIQUE', soundtrack: 'Bande originale',
      welcome: `Bienvenue dans l’édition ${french ? 'française' : 'anglaise'} de`,
      intro: french ? 'Retrouvez ici le livre audio en français et les chansons en allemand qui accompagnent le livre.' : 'Découvrez la musique qui accompagne le livre et retrouvez les lieux de ses histoires.',
      chapters: 'chapitres', songs: 'chansons', subtitle: french ? 'Chansons en allemand' : 'La musique du livre', audiobook: 'Livre audio',
      audiobookNote: `Le livre audio en ${french ? 'français' : 'anglais'} sera disponible prochainement.`,
      cards: 'Cartes', list: 'Liste', play: 'Écouter', playing: 'En lecture',
      loading: 'Chargement des titres…', unavailable: 'Les titres ne sont pas disponibles pour le moment.', retry: 'Réessayer',
      playlist: 'Ouvrir la playlist sur YouTube ↗',
    },
  }[language];
  return { ...copy, title, name };
}
