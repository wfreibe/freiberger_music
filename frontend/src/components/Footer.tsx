import { navigate } from '../router';
import { currentLang, t } from '../i18n';

export function Footer() {
  const handleNav = (e: MouseEvent, to: string) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <footer class="site-footer" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: '60px 48px 120px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '36px' }}>
        {/* Left Column: Brand & Tagline */}
        <div style={{ maxWidth: '420px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '6px' }}>
            FREIBERGER
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
            {t('footer_tagline')}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(56, 119, 128, 0.1)', border: '1px solid rgba(56, 119, 128, 0.25)', borderRadius: '4px', fontSize: '11px', color: 'var(--accent-turquoise)', letterSpacing: '0.04em' }}>
            <span>✓</span> {t('footer_privacy_badge')}
          </div>
        </div>

        {/* Right Column: Navigation Links & Legal */}
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '14px', fontWeight: 600 }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a href="#/" onClick={(e) => handleNav(e, '/')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  {t('nav_archive')}
                </a>
              </li>
              <li>
                <a href="#/places" onClick={(e) => handleNav(e, '/places')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  {t('nav_places')}
                </a>
              </li>
              <li>
                <a href="#/die-orte-die-uns-sahen" onClick={(e) => handleNav(e, '/die-orte-die-uns-sahen')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  DIE ORTE, DIE UNS SAHEN
                </a>
              </li>
              <li>
                <a href="#/the-places-that-saw-us" onClick={(e) => handleNav(e, '/the-places-that-saw-us')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  THE PLACES THAT SAW US
                </a>
              </li>
              <li>
                <a href="#/les-lieux-qui-nous-ont-vus" onClick={(e) => handleNav(e, '/les-lieux-qui-nous-ont-vus')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  LES LIEUX QUI NOUS ONT VUS
                </a>
              </li>
              <li>
                <a href="#/gard-7" onClick={(e) => handleNav(e, '/gard-7')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  {t('nav_gard7')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-sand)', marginBottom: '14px', fontWeight: 600 }}>
              {{ de: 'Rechtliches', en: 'Legal', fr: 'Informations légales' }[currentLang.value]}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a href="#/impressum" onClick={(e) => handleNav(e, '/impressum')} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }}>
                  {t('footer_link_legal')}
                </a>
              </li>
              <li>
                <a href="/studio" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px' }}>
                  Studio CMS ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ maxWidth: '1400px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--text-dim)' }}>
        <div>
          {t('footer_copyright')}
        </div>
        <div style={{ fontStyle: 'italic' }}>
          Music from places that remember.
        </div>
      </div>
    </footer>
  );
}
