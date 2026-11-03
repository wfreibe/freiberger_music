export type ReleaseType = 'film' | 'song' | 'audiobook' | 'single' | 'ep' | 'album' | 'chapter_audio' | 'gard7';

export interface Release {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  type: ReleaseType;
  release_date?: string | null;
  cover?: string | null;
  youtube_id?: string | null;
  youtube_playlist_id?: string | null;
  audio_url?: string | null;
  genre?: string | null;
  bpm?: number | null;
  duration?: string | null;
  description?: string | null;
  story?: string | null;
  lyrics?: string | null;
  place_id?: number | null;
  place_name?: string | null;
  place_slug?: string | null;
  place_accent?: string | null;
  chapter_id?: number | null;
  chapter_title?: string | null;
  chapter_number?: number | null;
  chapter_subtitle?: string | null;
  series_id?: number | null;
  series_title?: string | null;
  series_slug?: string | null;
  featured?: number | null;
  sort_order?: number | null;
  created_at?: string | null;
}

export interface Place {
  id: number;
  slug: string;
  name: string;
  greek_name?: string | null;
  tagline?: string | null;
  description?: string | null;
  coordinates?: string | null;
  image?: string | null;
  accent_color?: string | null;
  track_count?: number | null;
  sort_order?: number | null;
  created_at?: string | null;
  releases?: Release[];
  chapters?: Chapter[];
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  author?: string;
  description?: string;
  cover?: string;
  release_year?: number;
  formats?: string;
  language: 'de' | 'en' | 'fr';
  menu_label?: string | null;
  sort_order: number;
  show_in_navigation: number;
  is_published: number;
  soundtrack_source: 'series' | 'english_book';
  soundtrack_series_id?: number | null;
  audiobook_series_id?: number | null;
  purchase_url?: string | null;
  songs_playlist_url?: string | null;
  audiobook_playlist_url?: string | null;
  film_url?: string | null;
  film_youtube_id?: string | null;
  film_title?: string | null;
  film_duration?: string | null;
  chapters?: Chapter[];
}

export interface Chapter {
  id: number;
  book_id?: number | null;
  chapter_number: number;
  title: string;
  subtitle?: string | null;
  place_id?: number | null;
  place_name?: string | null;
  place_slug?: string | null;
  place_accent?: string | null;
  release_id?: number | null;
  release_title?: string | null;
  release_slug?: string | null;
  release_duration?: string | null;
  release_bpm?: number | null;
  release_youtube_id?: string | null;
  release_cover?: string | null;
  excerpt?: string | null;
  sort_order?: number | null;
}

export interface Series {
  id: number;
  slug: string;
  title: string;
  description?: string;
  sort_order?: number;
  releases?: Release[];
}
