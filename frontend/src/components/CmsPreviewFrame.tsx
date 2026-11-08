import { getApiBase } from '../api/client';
import { useEffect, useRef, useState } from 'preact/hooks';
export function CmsPreviewFrame({ area, id, revision, mobile, reload, title, draft, csrf, live = false }: { area: string; id: string | number; draft?: Record<string, string | number | null>; csrf?: string; live?: boolean; revision: string; mobile: boolean; reload: number; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameReady, setFrameReady] = useState(false);
  const [validated, setValidated] = useState<unknown>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!live || !draft) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(`${getApiBase()}/cms/preview`, {method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf || ''},body:JSON.stringify({area,id:Number(id)>0?Number(id):null,item:draft}),signal:controller.signal});
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Vorschau nicht verfügbar.');
        if (!controller.signal.aborted) {setValidated(data.item);setError('');}
      } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error?e.message:'Vorschau nicht verfügbar.'); } finally {clearTimeout(timeout);}
    }, 350);
    return () => {clearTimeout(timer);controller.abort();};
  }, [draft, live, area, id, csrf, reload]);
  useEffect(() => {if(live && frameReady && validated) frame.current?.contentWindow?.postMessage({type:'music-cms-preview',area,item:validated},location.origin);},[validated,frameReady,live,area]);
  useEffect(() => {
    const ready=(event:MessageEvent)=>{if(event.origin===location.origin && event.source===frame.current?.contentWindow && event.data?.type==='music-cms-preview-ready')setFrameReady(true);};
    window.addEventListener('message',ready);return()=>window.removeEventListener('message',ready);
  }, []);
  const viewport = mobile ? 375 : 1280;
  const scale = Math.min(1, availableWidth / viewport);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(entries => setAvailableWidth(entries[0].contentRect.width));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return <><p role="status" style={{padding: error ? '12px' : '0'}}>{error}</p><div ref={container} class={`cms-workspace-preview-area ${mobile ? 'is-mobile' : ''}`}>
    {scale > 0 && <iframe ref={frame} onLoad={() => {setFrameReady(true); if(live && validated) frame.current?.contentWindow?.postMessage({type:'music-cms-preview',area,item:validated},location.origin);}} class="cms-website-frame" key={`${area}:${id}:${live ? "draft" : revision}:${reload}`} title={`Webseitenvorschau: ${title}`}
      style={{ width: `${viewport}px`, height: `${660 / scale}px`, transform: `scale(${scale})` }}
      src={`/cms/preview?area=${encodeURIComponent(area)}&id=${id}${live ? "&mode=draft" : ""}`} />}
  </div></>;
}
