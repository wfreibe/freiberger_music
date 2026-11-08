import {SectionImageUpload} from './SectionImageUpload';
import {IconButton} from './CmsActions';
import {moveBlock} from '../utils/contentBlocks';
export function GalleryFields({images,onChange,csrfToken,onBusyChange,busy}) {
 const change=(index,patch)=>onChange(images.map((image,i)=>i===index?{...image,...patch}:image));
 return <div>{images.map((image,index)=><fieldset key={index} className="block-item-editor" disabled={busy}><legend>Bild {index+1}</legend>
  <SectionImageUpload value={image.src} onChange={src=>change(index,{src})} csrfToken={csrfToken} onBusyChange={onBusyChange} disabled={busy}/>
  <label>Bildtitel<input value={image.title||''} onInput={e=>change(index,{title:e.target.value})}/></label>
  <label>Bildunterschrift<input value={image.caption||''} onInput={e=>change(index,{caption:e.target.value})}/></label>
  <IconButton icon="up" label={`Bild ${index+1} nach oben`} disabled={!index} onClick={()=>onChange(moveBlock(images,index,index-1))}/>
  <IconButton icon="down" label={`Bild ${index+1} nach unten`} disabled={index===images.length-1} onClick={()=>onChange(moveBlock(images,index,index+1))}/>
  <IconButton icon="trash" label={`Bild ${index+1} entfernen`} onClick={()=>onChange(images.filter((_,i)=>i!==index))}/>
 </fieldset>)}<button type="button" disabled={busy||images.length>=50} onClick={()=>onChange([...images,{src:'',title:'',caption:''}])}>Bild hinzufügen</button></div>;
}
