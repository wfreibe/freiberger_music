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

export function App() {
  const path = getCleanPath();

  // Simple, robust client-side route dispatch
  let pageComponent = <HomePage />;

  if (path.startsWith('/places')) {
    pageComponent = <PlacesPage />;
  } else if (path === '/die-orte-die-uns-sahen' || path === '/die-orte-die-mich-sahen') {
    pageComponent = <BookPage />;
  } else if (path === '/the-places-that-saw-us') {
    pageComponent = <BookEditionPage key="en" edition="en" />;
  } else if (path === '/les-lieux-qui-nous-ont-vus') {
    pageComponent = <BookEditionPage key="fr" edition="fr" />;
  } else if (path === '/gard-7' || path === '/gard7') {
    pageComponent = <Gard7Page />;
  } else if (path === '/impressum' || path === '/datenschutz' || path === '/legal') {
    pageComponent = <LegalPage />;
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
