import {pages} from '../data/pages';
import {currentLang} from '../i18n';
import {getCleanPath,navigate} from '../router';
export function PageNavigation({mobile=false,onNavigate=()=>{}}:{mobile?:boolean;onNavigate?:()=>void}) {
 const items=pages.value.filter(p=>p.show_in_navigation===1&&p.language===currentLang.value).sort((a,b)=>a.sort_order-b.sort_order||a.id-b.id);
 const link=(page:typeof items[number])=><a class={mobile?'mobile-nav-link':'nav-link'} href={`/${page.slug}`} aria-current={getCleanPath()===`/${page.slug}`?'page':undefined} onClick={e=>{e.preventDefault();navigate(`/${page.slug}`);onNavigate();}}>{page.menu_label||page.title}</a>;
 const render=(page:typeof items[number]):preact.ComponentChildren=>{
  const children=items.filter(child=>child.parent_id===page.id);
  return children.length?<details key={page.id} class="cms-page-menu"><summary class={mobile?'mobile-nav-link':'nav-link'}>{page.menu_label||page.title}</summary><div>{link(page)}{children.map(render)}</div></details>:link(page);
 };
 return <>{items.filter(p=>!p.parent_id).map(render)}</>;
}
