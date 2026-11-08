import {signal} from '@preact/signals';
import {getApiBase} from '../api/client';
import type {CmsPageContent} from '../types';
export const pages=signal<CmsPageContent[]>([]);
export async function loadPages() {
  try {const res=await fetch(`${getApiBase()}/pages`,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error('Seiten nicht erreichbar');pages.value=await res.json();}catch{pages.value=[];}
}
