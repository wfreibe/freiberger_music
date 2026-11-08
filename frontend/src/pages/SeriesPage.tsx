import {useEffect,useState} from 'preact/hooks';
import type {Series} from '../types';
import {getApiBase} from '../api/client';
import {ContentBlocks} from '../components/ContentBlocks';
import {ReleaseSlider} from '../components/ReleaseSlider';
import {setTrackList} from '../player/playerStore';
export function SeriesPage({slug}:{slug:string}) {
 const [series,setSeries]=useState<Series|null>(null),[error,setError]=useState(false);
 useEffect(()=>{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  setSeries(null);setError(false);
  fetch(`${getApiBase()}/series/${encodeURIComponent(slug)}`,{signal:controller.signal}).then(async res=>{if(!res.ok)throw new Error();return res.json();})
   .then(data=>{setSeries(data);setTrackList(data.releases||[]);}).catch(()=>{if(!controller.signal.aborted)setError(true);}).finally(()=>clearTimeout(timeout));
  return()=>{clearTimeout(timeout);controller.abort();};
 },[slug]);
 if(!series)return <div class="hero-stage" role="status">{error?'Serie nicht erreichbar.':'Serie wird geladen …'}</div>;
 return <div class="hero-stage"><h1 class="hero-headline">{series.title}</h1><ContentBlocks value={series.content_blocks}><p>{series.description}</p><ReleaseSlider title={series.title} releases={series.releases||[]}/></ContentBlocks></div>;
}
