import {ContentBlocks} from '../components/ContentBlocks';
import type {CmsPageContent} from '../types';
export function ContentPage({page}:{page:CmsPageContent}) {
 return <div class="hero-stage" style={{paddingBottom:'90px'}}><h1 class="hero-headline">{page.title}</h1><ContentBlocks value={page.content_blocks}><p>{page.description}</p></ContentBlocks></div>;
}
