import {SeriesPage} from './pages/SeriesPage';
import {pages,loadPages} from './data/pages';
import {ContentPage} from './pages/ContentPage';
import { PlaylistBookPage } from './pages/PlaylistBookPage';
import { AmbientStage } from './components/AmbientStage';
import { HeaderNav } from './components/HeaderNav';
import { PlayerBar } from './components/PlayerBar';
import { PlayerDrawer } from './components/PlayerDrawer';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PlacesPage } from './pages/PlacesPage';
import { BookPage } from './pages/BookPage';
import { BookEditionPage } from './pages/BookEditionPage';
import { LegalPage } from './pages/LegalPage';
import { Gard7Page } from './pages/Gard7Page';
import { getCleanPath } from './router';
import { useEffect } from 'preact/hooks';
import { books, booksError, findBook, loadBooks } from './data/books';
import { setLanguage } from './i18n';

export function App() {
  const path = getCleanPath();
  const page = pages.value.find(page=>`/${page.slug}`===path);
  const book = findBook(books.value ?? [], path);
  useEffect(() => {
    void loadBooks(); void loadPages();
    const refresh = () => { void loadBooks(); void loadPages(); };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);
  useEffect(() => { if (book || page) setLanguage((book || page)!.language); }, [path, book?.id, book?.language, page?.id, page?.language]);

  // Simple, robust client-side route dispatch
  let pageComponent = <HomePage />;

  if (path.startsWith('/series/')) {
    pageComponent=<SeriesPage slug={path.slice(8)}/>;
  } else if (path === '/places' || path.startsWith('/places/')) {
    pageComponent = <PlacesPage />;
  } else if (path === '/gard-7' || path === '/gard7') {
    pageComponent = <Gard7Page />;
  } else if (path === '/impressum' || path === '/datenschutz' || path === '/legal') {
    pageComponent = <LegalPage />;
  } else if (page) {
    pageComponent = <ContentPage key={page.id} page={page}/>;
  } else if (book) {
    pageComponent = book.songs_playlist_url && book.soundtrack_series_id == null ? <PlaylistBookPage key={book.id} book={book} /> : book.language === 'de' ? <BookPage key={book.id} book={book} />
      : <BookEditionPage key={book.id} edition={book.language} book={book} />;
  } else if (path !== '/') {
    pageComponent = <div class="hero-stage" role="status">
      <h1 class="hero-headline">{booksError.value ? 'Seite nicht erreichbar' : books.value === null ? 'Seite wird geladen …' : 'Seite nicht verfügbar'}</h1>
      {booksError.value && <button class="btn-editorial btn-editorial-ghost" onClick={() => void loadBooks()}>Erneut laden</button>}
    </div>;
  }

  return (
    <div class="app-container">
      {/* 1. Dynamic generative ambient background */}
      <AmbientStage />

      {/* 2. Top Navigation */}
      <HeaderNav />

      {/* 3. Active Page View */}
      <main class="main-content">
        {pageComponent}
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Persistent Player Bar (Always pinned at bottom, never unmounts on navigation) */}
      <PlayerBar />

      {/* 6. Expandable Full Player Drawer (Modal / Sheet) */}
      <PlayerDrawer />
    </div>
  );
}
