export function getMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Handle local XAMPP subfolder /freiberger-music
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/freiberger-music')) {
    if (!url.startsWith('/freiberger-music/')) {
      return '/freiberger-music' + (url.startsWith('/') ? url : '/' + url);
    }
  }

  return url;
}
