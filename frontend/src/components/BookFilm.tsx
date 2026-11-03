import type { Book } from '../types';
import { bookFilm } from '../data/books';
import { currentLang } from '../i18n';
import { activeTrack, isPlaying, playTrack, setTrackList } from '../player/playerStore';

export function BookFilm({ book }: { book: Book }) {
  const film = bookFilm(book);
  if (!film) return null;
  const copy = {
    de: { heading: 'Der Film', play: 'Film abspielen', playing: 'Film läuft' },
    en: { heading: 'The film', play: 'Play film', playing: 'Film playing' },
    fr: { heading: 'Le film', play: 'Lire le film', playing: 'Film en cours' },
  }[currentLang.value];
  const playing = activeTrack.value?.id === film.id && isPlaying.value;
  return <section class="content-section" aria-label={copy.heading}>
    <h2 class="section-title">{copy.heading}</h2>
    <button type="button" class={`english-track english-track-card ${playing ? 'is-playing' : ''}`}
      style={{ width: 'min(100%, 520px)', textAlign: 'left' }} aria-label={`${copy.play}: ${film.title}`}
      onClick={() => { setTrackList([film]); playTrack(film, true); }}>
      <span class="card-cover-box english-track-cover" style={{ aspectRatio: '16 / 9' }}>
        <img src={film.cover!} class="card-cover" alt="" loading="lazy" />
        <span class="card-play-hover"><span class="play-circle-btn" aria-hidden="true">▶</span></span>
      </span>
      <span class="english-track-title">{film.title}</span>
      {film.duration && <span class="english-track-duration">{film.duration}</span>}
      <span class="english-track-play">{playing ? copy.playing : `▶ ${copy.play}`}</span>
    </button>
  </section>;
}
