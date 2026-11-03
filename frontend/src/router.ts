import { signal } from '@preact/signals';

export function getSubfolderPrefix(): string {
  if (typeof window !== 'undefined' && (window.location.pathname === '/freiberger-music' || window.location.pathname.startsWith('/freiberger-music/'))) {
    return '/freiberger-music';
  }
  return '';
}

// Read initial route from pathname or legacy hash
function getInitialRoute(): string {
  if (typeof window === 'undefined') return '/';

  const prefix = getSubfolderPrefix();

  // 1. Backward compatibility: check hash first for existing links/bookmarks
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    const hashPath = window.location.hash.slice(1);
    // Upgrade URL in browser address bar to clean history URL without page reload
    const cleanUrl = (prefix + hashPath) || '/';
    try {
      window.history.replaceState(null, '', cleanUrl);
    } catch (_) {}
    return hashPath;
  }

  // 2. Clean HTML5 pathname
  let path = window.location.pathname;
  if (prefix && path.startsWith(prefix)) {
    path = path.slice(prefix.length) || '/';
  }
  return path || '/';
}

export const currentRoute = signal<string>(getInitialRoute());

// Normalize route
export function getCleanPath(path: string = currentRoute.value): string {
  let p = path;
  const prefix = getSubfolderPrefix();
  if (prefix && p.startsWith(prefix)) {
    p = p.slice(prefix.length) || '/';
  }
  if (p.startsWith('#/')) {
    p = p.slice(1);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p === '/the_places_that_saw_us' ? '/the-places-that-saw-us' : p;
}

export function navigate(to: string): void {
  const clean = to.startsWith('/') ? to : '/' + to;
  const prefix = getSubfolderPrefix();
  const targetUrl = prefix + clean;

  const update = () => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
      currentRoute.value = clean;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Use native View Transition API if supported by browser
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      update();
    });
  } else {
    update();
  }
}

if (typeof window !== 'undefined') {
  // Listen to browser back/forward buttons
  window.addEventListener('popstate', () => {
    currentRoute.value = getInitialRoute();
  });

  // Backward compatibility: if a legacy hash link is clicked
  window.addEventListener('hashchange', () => {
    if (window.location.hash.startsWith('#/')) {
      const hashPath = window.location.hash.slice(1);
      navigate(hashPath);
    }
  });
}
