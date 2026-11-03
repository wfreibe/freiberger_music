import { useState } from 'preact/hooks';
import { BookNavigation } from './BookNavigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getCleanPath, navigate } from '../router';
import { currentLang, t } from '../i18n';

export function HeaderNav() {
  const path = getCleanPath();
  const lang = currentLang.value;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (e: MouseEvent, target: string) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate(target);
  };

  return (
    <header class="site-header">
      <a href="#/" onClick={(e) => handleNav(e, '/')} class="brand-logo">
        <span class="brand-title">FREIBERGER</span>
        <span class="brand-tagline">{t('brand_tagline')}</span>
      </a>

      {/* Desktop Navigation */}
      <nav class="site-nav desktop-nav">
        <a
          href="#/"
          onClick={(e) => handleNav(e, '/')}
          class={`nav-link ${path === '/' ? 'active' : ''}`}
        >
          {t('nav_archive')}
        </a>
        <a
          href="#/places"
          onClick={(e) => handleNav(e, '/places')}
          class={`nav-link ${path.startsWith('/places') ? 'active' : ''}`}
        >
          {t('nav_places')}
        </a>
        <BookNavigation onNavigate={() => setMobileOpen(false)} />
        <a
          href="#/gard-7"
          onClick={(e) => handleNav(e, '/gard-7')}
          class={`nav-link ${path.startsWith('/gard') ? 'active' : ''}`}
        >
          {t('nav_gard7')}
        </a>

        {/* Language Switcher */}
        <LanguageSwitcher />

        <a href="studio/" target="_blank" rel="noopener noreferrer" class="studio-pill">
          {t('nav_studio')}
        </a>
      </nav>

      {/* Mobile Header Actions (Lang + Hamburger) */}
      <div class="mobile-header-actions">
        <LanguageSwitcher mobile />

        <button
          type="button"
          class="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={lang === 'fr' ? (mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu') : lang === 'en' ? (mobileOpen ? 'Close menu' : 'Open menu') : (mobileOpen ? 'Menü schließen' : 'Menü öffnen')}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Slide-Down Menu */}
      <div class={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <a
          href="#/"
          onClick={(e) => handleNav(e, '/')}
          class={`mobile-nav-link ${path === '/' ? 'active' : ''}`}
        >
          ♫ {t('nav_archive')}
        </a>
        <a
          href="#/places"
          onClick={(e) => handleNav(e, '/places')}
          class={`mobile-nav-link ${path.startsWith('/places') ? 'active' : ''}`}
        >
          🗺️ {t('nav_places')}
        </a>
        <BookNavigation mobile onNavigate={() => setMobileOpen(false)} />
        <a
          href="#/gard-7"
          onClick={(e) => handleNav(e, '/gard-7')}
          class={`mobile-nav-link ${path.startsWith('/gard') ? 'active' : ''}`}
        >
          ⚡ {t('nav_gard7')}
        </a>
        <a
          href="studio/"
          target="_blank"
          rel="noopener noreferrer"
          class="mobile-nav-link studio-link"
          onClick={() => setMobileOpen(false)}
        >
          ⚙️ {t('nav_studio')}
        </a>
        <a
          href="#/impressum"
          onClick={(e) => handleNav(e, '/impressum')}
          class={`mobile-nav-link ${path === '/impressum' ? 'active' : ''}`}
          style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}
        >
          § {t('footer_link_legal')}
        </a>
      </div>
    </header>
  );
}
