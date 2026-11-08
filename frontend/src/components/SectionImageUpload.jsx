import {getApiBase} from '../api/client';
import {useState} from 'preact/hooks';
import {localImage} from '../utils/contentBlocks';
export function SectionImageUpload({value,onChange,csrfToken,onBusyChange,disabled=false,fieldLabel='Bild'}) {
 const [error,setError]=useState('');
 const upload=async event=>{
  const file=event.currentTarget.files?.[0];if(!file)return;setError('');onBusyChange?.(true);
  try{
   if(file.size>8*1024*1024)throw new Error('Bild ist größer als 8 MiB.');
   const body=new FormData();body.set('image',file);
   const res=await fetch(`${getApiBase()}/cms/upload`,{method:'POST',credentials:'same-origin',headers:{'X-CSRF-Token':csrfToken},body,signal:AbortSignal.timeout(30000)});
   const data=await res.json();if(!res.ok)throw new Error(data.message||'Upload fehlgeschlagen.');onChange(data.url);
  }catch(error){setError(error.message);}finally{onBusyChange?.(false);}
 };
 return <div className="section-image-upload"><label>{fieldLabel}<input value={value} onInput={event=>onChange(event.currentTarget.value)} disabled={disabled}/></label>
  <label>Bild hochladen (max. 8 MiB)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={upload}/></label>
  {localImage(value)&&<img src={value} alt="Bildvorschau" style={{maxWidth:'200px',maxHeight:'120px',objectFit:'contain'}}/>}{error&&<p role="alert">{error}</p>}
 </div>;
}
