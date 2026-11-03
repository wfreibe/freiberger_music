import { useEffect, useRef, useState } from 'preact/hooks';
import { getCleanPath, getSubfolderPrefix, navigate } from '../router';
import { currentLang } from '../i18n';

const editions = [
  { path: '/die-orte-die-uns-sahen', title: 'DIE ORTE, DIE UNS SAHEN' },
  { path: '/the-places-that-saw-us', title: 'THE PLACES THAT SAW US' },
  { path: '/les-lieux-qui-nous-ont-vus', title: 'LES LIEUX QUI NOUS ONT VUS' },
];

export function BookNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = getCleanPath();
  const active = editions.some(edition => edition.path === path) || path === '/die-orte-die-mich-sahen';
  const menuId = mobile ? 'mobile-book-menu' : 'desktop-book-menu';

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return (
    <div ref={container} class={`book-navigation ${mobile ? 'book-navigation-mobile' : ''}`}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          setOpen(false);
          trigger.current?.focus();
        }
      }}>
      <button ref={trigger} type="button"
        class={`${mobile ? 'mobile-nav-link' : 'nav-link'} book-menu-trigger ${active ? 'active' : ''}`}
        aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
        {{ de: 'Bücher', en: 'Books', fr: 'Livres' }[currentLang.value]} <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && <div id={menuId} class="book-menu-links">
        {editions.map(edition => {
          const selected = path === edition.path || (edition.path === editions[0].path && path === '/die-orte-die-mich-sahen');
          return <a key={edition.path} href={getSubfolderPrefix() + edition.path}
            aria-current={selected ? 'page' : undefined}
            class={`book-menu-link ${selected ? 'active' : ''}`}
            onClick={event => {
              if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              setOpen(false);
              onNavigate();
              navigate(edition.path);
            }}>{edition.title}</a>;
        })}
      </div>}
    </div>
  );
}
