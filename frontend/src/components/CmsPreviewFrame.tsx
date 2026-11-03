import { useEffect, useRef, useState } from 'preact/hooks';

export function CmsPreviewFrame({ area, id, revision, mobile, reload, title }: { area: string; id: string | number; revision: string; mobile: boolean; reload: number; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const viewport = mobile ? 375 : 1280;
  const scale = Math.min(1, availableWidth / viewport);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(entries => setAvailableWidth(entries[0].contentRect.width));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} class={`cms-workspace-preview-area ${mobile ? 'is-mobile' : ''}`}>
    {scale > 0 && <iframe class="cms-website-frame" key={`${area}:${id}:${revision}:${reload}`} title={`Webseitenvorschau: ${title}`}
      style={{ width: `${viewport}px`, height: `${660 / scale}px`, transform: `scale(${scale})` }}
      src={`/cms/preview?area=${encodeURIComponent(area)}&id=${id}`} />}
  </div>;
}
