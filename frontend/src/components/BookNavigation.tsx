import { useEffect, useRef, useState } from 'preact/hooks';
import { getCleanPath, getSubfolderPrefix, navigate } from '../router';
import { currentLang } from '../i18n';
import { books, bookMenu, booksError, findBook, loadBooks } from '../data/books';

export function BookNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate: () => void }) {
  const editions = bookMenu(books.value ?? []).map(book => ({ path: '/' + book.slug, title: book.menu_label || book.title }));
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = getCleanPath();
  const active = Boolean(findBook(books.value ?? [], path));
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
          const selected = path === edition.path || (edition.path === '/die-orte-die-uns-sahen' && path === '/die-orte-die-mich-sahen');
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
        {booksError.value && <button class="book-menu-link" onClick={() => void loadBooks()}>Bücher erneut laden</button>}
      </div>}
    </div>
  );
}
