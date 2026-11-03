import { render } from 'preact';

async function start() {
  const root = document.getElementById('app');
  if (root) {
    if (window.location.pathname === '/cms/preview') {
      await import('./styles/ambient.css');
      await import('./styles/main.css');
      const { CmsPreviewPage } = await import('./pages/CmsPreviewPage');
      render(<CmsPreviewPage />, root);
    } else if (/^\/(cms|studio)(\/|$)/.test(window.location.pathname)) {
      const { CmsPage } = await import('./pages/CmsPage');
      render(<CmsPage />, root);
    } else {
      await import('./styles/ambient.css');
      await import('./styles/main.css');
      const { App } = await import('./App');
      render(<App />, root);
    }
  }
}
void start();
