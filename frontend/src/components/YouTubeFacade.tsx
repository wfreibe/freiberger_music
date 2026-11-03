import { useState } from 'preact/hooks';
import { isVideoLoaded, activateYouTubeEmbed } from '../player/playerStore';
import { t } from '../i18n';

interface YouTubeFacadeProps {
  youtubeId: string;
  title: string;
  coverUrl?: string | null;
  forceLoaded?: boolean;
}

export function YouTubeFacade({ youtubeId, title, coverUrl, forceLoaded }: YouTubeFacadeProps) {
  const [localActive, setLocalActive] = useState(false);
  const active = forceLoaded || isVideoLoaded.value || localActive;

  const handleStart = () => {
    setLocalActive(true);
    activateYouTubeEmbed();
  };

  if (active && youtubeId) {
    const origin = typeof window !== 'undefined' && window.location?.origin ? encodeURIComponent(window.location.origin) : '';
    const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1${origin ? `&origin=${origin}` : ''}&rel=0&modestbranding=1`;

    return (
      <div class="drawer-youtube-box">
        <iframe
          key={youtubeId}
          id="freiberger-youtube-iframe"
          src={src}
          title={`YouTube Player: ${title}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          onLoad={() => {
            const iframe = document.getElementById('freiberger-youtube-iframe') as HTMLIFrameElement | null;
            if (iframe?.contentWindow) {
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), 'https://www.youtube-nocookie.com');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div class="drawer-youtube-box">
      <div
        class="youtube-facade"
        onClick={handleStart}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStart();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${t('youtube_load_stream')}: ${title}`}
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt={title}
            class="youtube-facade-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
        <div class="youtube-facade-content">
          <div class="play-circle-btn" style={{ width: '56px', height: '56px' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ marginLeft: '3px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('youtube_load_stream')}
          </div>
          <div class="privacy-notice">
            {t('youtube_privacy_notice')}
          </div>
        </div>
      </div>
    </div>
  );
}
