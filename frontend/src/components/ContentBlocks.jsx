import {useEffect,useState} from 'preact/hooks';
import {pageBlocks,imageDefaults,youtubeId,localImage,localAudio,safeBlockLink} from '../utils/contentBlocks';
import {sanitizeHtml} from '../utils/sanitizeHtml';
import {Slideshow} from './Slideshow';
import '../styles/music-blocks.css';

function Html({value}) { return <div dangerouslySetInnerHTML={{__html:sanitizeHtml(value||'')}}/>; }
function Video({data}) {
 const id=youtubeId(data.video),[active,setActive]=useState(false);
 useEffect(()=>setActive(false),[id]);
 if(!id)return null;
 return <figure><div className="music-block-video">{active?
  <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={data.title||'YouTube-Video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:
  <div>{localImage(data.cover)&&<img src={data.cover} alt=""/>}<p>Beim Laden wird eine Verbindung zu YouTube/Google hergestellt. Dabei wird unter anderem deine IP-Adresse übertragen.</p><button className="btn-editorial btn-editorial-ghost" type="button" onClick={()=>setActive(true)}>YouTube-Video laden</button></div>}</div>
  {active&&<button type="button" className="btn-editorial btn-editorial-ghost" onClick={()=>setActive(false)}>Video schließen</button>}{data.caption&&<figcaption>{data.caption}</figcaption>}</figure>;
}
/** Shared renderer for public content and both previews.
 * @param {{value?: any, children?: import("preact").ComponentChildren}} props
 */
export function ContentBlocks({value,children=null}) {
 const blocks=pageBlocks(value).filter(b=>b.enabled);
 return <>{blocks.map(block=>{
  if(block.type==='legacy')return <>{children}</>;
  const d=block.data||{},o={...imageDefaults,...d.options};let content;
  if(block.type==='text')content=<Html value={d.html}/>;
  if(block.type==='image')content=<div className={`music-block-image ${o.layout==='beside'?'is-beside':''} ${o.align==='right'?'is-right':''}`}>
   {localImage(d.src)&&<figure style={{width:o.width+'%',marginLeft:o.align==='left'?0:'auto',marginRight:o.align==='right'?0:'auto'}}><img src={d.src} alt={d.alt||''} loading="lazy" style={{aspectRatio:o.format==='original'?'auto':o.format.replace(':',' / '),objectFit:o.format==='original'?'contain':'cover',objectPosition:`${o.focus_x}% ${o.focus_y}%`}}/>{d.caption&&<figcaption>{d.caption}</figcaption>}</figure>}<Html value={d.html}/></div>;
  if(block.type==='slideshow')content=<Slideshow images={(d.images||[]).filter(i=>localImage(i.src))} options={{'slide-duration':(d.interval||5)*1000,'effect-speed':800,fullscreen:'true'}}/>;
  if(block.type==='accordion')content=(d.items||[]).filter(i=>i.enabled!==false).map(item=><details key={item.id}><summary>{item.title}</summary><Html value={item.html}/></details>);
  if(block.type==='youtube')content=<Video data={d}/>;
  if(block.type==='audio'&&localAudio(d.src))content=<figure><audio controls preload="none" src={d.src} aria-label={d.title||'Audio'}/><figcaption>{d.caption}</figcaption></figure>;
  if(block.type==='link'&&safeBlockLink(d.href))content=<a className={d.style==='button'?'btn-editorial btn-editorial-ghost':''} href={safeBlockLink(d.href)}>{d.label||d.title||'Link öffnen'} ↗</a>;
  return <section key={block.id} className="music-content-block" data-block-id={block.id}>{d.title&&<h2 className="section-title">{d.title}</h2>}{content}</section>;
 })}</>;
}
