import { CmsPreviewFrame } from '../components/CmsPreviewFrame';
import { useEffect, useState } from 'preact/hooks';
import { getApiBase } from '../api/client';
import '../styles/cms-workspace.css';
import '../styles/music-cms.css';

type Item = Record<string, string | number | null>;
type RecordVersion = { item: Item; revision: string };
type Field = { name: string; type: string; notnull: number; dflt_value: string | null };
type Collection = { items: RecordVersion[]; fields: Field[]; choices: Record<string, { id: number; label: string }[]> };
const areas: Record<string, string> = { releases: 'Musik & Hörbücher', books: 'Bücher', chapters: 'Buchkapitel', places: 'Orte', series: 'Alben & Serien' };
const links: Record<string, string> = { place_id: 'places', book_id: 'books', chapter_id: 'chapters', release_id: 'releases', series_id: 'series' };
const labels: Record<string, string> = { slug: 'URL-Name', title: 'Titel', name: 'Name', subtitle: 'Untertitel', type: 'Inhaltstyp', release_date: 'Veröffentlichung', cover: 'Cover', youtube_id: 'YouTube-Video oder Video-Link', youtube_playlist_id: 'YouTube-Playlist-ID', genre: 'Genre', bpm: 'Tempo (BPM)', duration: 'Dauer', description: 'Beschreibung', story: 'Geschichte', lyrics: 'Songtext', featured: 'Hervorgehoben', sort_order: 'Reihenfolge', place_id: 'Ort', book_id: 'Buch', chapter_id: 'Kapitel', release_id: 'Veröffentlichung', series_id: 'Album / Serie', greek_name: 'Griechischer Name', tagline: 'Leitsatz', coordinates: 'Koordinaten', image: 'Bild', accent_color: 'Akzentfarbe', chapter_number: 'Kapitelnummer', excerpt: 'Auszug', author: 'Autor' };
const longText = new Set(['description', 'story', 'lyrics', 'excerpt']);
Object.assign(links, { soundtrack_series_id: 'series', audiobook_series_id: 'series' });
Object.assign(labels, { release_year: 'Erscheinungsjahr', formats: 'Formate (durch · trennen)', purchase_url: 'Buch kaufen (HTTPS-Link)', songs_playlist_url: 'Songs – YouTube-Playlist', audiobook_playlist_url: 'Hörbuch – YouTube-Playlist', film_url: 'Film – HTTPS-Link', language: 'Sprache der Buchausgabe', menu_label: 'Menübezeichnung (leer = Buchtitel)', show_in_navigation: 'Im Bücher-Menü anzeigen', is_published: 'Veröffentlicht / öffentlich erreichbar', soundtrack_source: 'Soundtrack-Quelle', soundtrack_series_id: 'Serie für den Soundtrack', audiobook_series_id: 'Serie für das Hörbuch' });

export function CmsPage() {
  const [csrf, setCsrf] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [area, setArea] = useState('releases');
  const [collection, setCollection] = useState<Collection | null>(null);
  const [selected, setSelected] = useState<RecordVersion | null>(null);
  const [draft, setDraft] = useState<Item | null>(null);
  const [filter, setFilter] = useState('');
  const [showList, setShowList] = useState(true);
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'mobile'>('desktop');
  const [previewReload, setPreviewReload] = useState(0);
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(selected?.item ?? null);

  async function request(route: string, method = 'GET', body?: unknown) {
    const res = await fetch(`${getApiBase()}/cms/${route}`, {
      method, credentials: 'same-origin', signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json();
    if (data.csrf_token) setCsrf(data.csrf_token);
    if (!res.ok) {
      if (res.status === 401 && route !== 'login') { setAuthenticated(false); setDraft(null); }
      throw new Error(data.message || data.error || 'Anfrage fehlgeschlagen.');
    }
    return data;
  }

  async function load(target: string) {
    setCollection(null);
    const data = await request(target);
    setCollection(data);
  }

  useEffect(() => {
    request('session').then(data => { setAuthenticated(data.authenticated); setChangePassword(data.passwordChangeRequired); })
      .catch(() => setMessage('CMS nicht erreichbar. Konfiguration und Datenmigration prüfen.')).finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (authenticated && !changePassword) load(area).catch(error => setMessage(error.message));
  }, [authenticated, changePassword, area]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function mayLeave() { return !dirty || window.confirm('Ungespeicherte Änderungen verwerfen?'); }
  async function perform(action: () => Promise<void>) {
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Vorgang fehlgeschlagen.'); }
    finally { setBusy(false); }
  }

  if (!ready) return <div class="music-cms cms-login-page">CMS wird geladen …</div>;
  if (!authenticated || changePassword) return <div class="music-cms cms-login-page"><form class="music-cms-login" onSubmit={event => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    perform(async () => {
      const data = await request(changePassword ? 'password' : 'login', 'POST', Object.fromEntries(form));
      setAuthenticated(data.authenticated ?? data.success); setChangePassword(data.passwordChangeRequired ?? false);
    });
  }}><h1>FREIBERGER.MUSIC</h1><p>{changePassword ? 'Für den Erstzugang ein eigenes Passwort setzen (16–72 Byte, Buchstaben und Ziffern).' : 'Redaktionsbereich'}</p>
    {!changePassword && <label>Benutzername<input name="username" autoComplete="username" required defaultValue="admin" /></label>}
    <label>{changePassword ? 'Neues Passwort' : 'Passwort'}<input name="password" type="password" autoComplete={changePassword ? 'new-password' : 'current-password'} minLength={changePassword ? 16 : undefined} maxLength={changePassword ? 72 : 1024} required /></label>
    {changePassword && <label>Passwort bestätigen<input name="confirmation" type="password" autoComplete="new-password" required /></label>}
    <p role="status">{message}</p><button disabled={busy || !csrf}>{changePassword ? 'Passwort speichern' : 'Anmelden'}</button><a href="/">Zur Website</a>
  </form></div>;

  return <div class="music-cms cms-workspace"><aside class="cms-workspace-sidebar"><div class="cms-workspace-brand"><strong>FREIBERGER.MUSIC</strong><small>REDAKTIONSBEREICH</small></div><div class="cms-workspace-nav-group"><p class="cms-workspace-nav-label">INHALTE VERWALTEN</p><nav aria-label="Inhaltsbereiche">
    {Object.entries(areas).map(([key, label]) => <button class={`cms-workspace-nav-item ${key === area ? 'is-selected' : ''}`} disabled={busy} aria-current={key === area ? 'page' : undefined} onClick={() => {
      if (key !== area && mayLeave()) { setArea(key); setShowList(true); setDraft(null); setSelected(null); setMessage(''); setFilter(''); }
    }}>{label}</button>)}
    </nav></div><div class="cms-workspace-sidebar-bottom"><p>Inhalte pflegen.<br />Geschichten erzählen.</p><a href="/" target="_blank" rel="noopener">Website ansehen ↗</a><button disabled={busy} onClick={() => { if (mayLeave()) perform(async () => { await request('logout', 'POST', {}); setAuthenticated(false); setDraft(null); const data = await request('session'); setCsrf(data.csrf_token); }); }}>Abmelden</button>
  </div></aside><div class="cms-workspace-shell"><header class="cms-workspace-topbar"><div class="cms-workspace-breadcrumb">Redaktionsbereich <span>/</span> <strong>{areas[area]}</strong></div><span class="cms-workspace-avatar" aria-label="Administrator">WF</span></header><main class="music-cms-main cms-workspace-main"><header class="cms-workspace-heading"><div><span class="cms-workspace-eyebrow">RAUM FÜR DEINE INHALTE</span><h1>{areas[area]}</h1><p>Inhalte bearbeiten und die gespeicherte Ansicht deiner Website prüfen.</p></div><button disabled={busy || !collection} onClick={() => {
    if (!mayLeave() || !collection) return;
    const item: Item = {};
    for (const f of collection.fields) item[f.name] = f.dflt_value === null ? '' : f.dflt_value.replace(/^'(.*)'$/, '$1');
    setSelected(null); setDraft(item); setMessage('');
  }} class="cms-workspace-button cms-workspace-button-primary">＋ Neuer Inhalt</button></header><div class="cms-workspace-statusline"><span><i aria-hidden="true" /> Redaktionsbereich aktiv</span><span>{dirty ? 'Ungespeicherte Änderungen' : 'Gespeicherte Inhalte'}</span></div><p role="status" aria-live="polite" class="music-cms-message">{message}</p>
  {!collection ? <p>Inhalte werden geladen …</p> : <div class="music-cms-columns"><section class="cms-workspace-card music-cms-collection" aria-label="Inhaltsliste"><details open={showList} onToggle={event => setShowList(event.currentTarget.open)}><summary class="cms-workspace-card-head"><span><strong>Inhalt auswählen</strong>{selected && <small> · {selected.item.title || selected.item.name}</small>}</span><span>{collection.items.length} Einträge ⌄</span></summary><div class="cms-workspace-card-body"><input aria-label="Inhalte filtern" placeholder="Suchen …" value={filter} onInput={event => setFilter(event.currentTarget.value)} /><ul class="music-cms-list">
    {collection.items.filter(row => String(row.item.title || row.item.name).toLowerCase().includes(filter.toLowerCase())).map(row => <li><button disabled={busy} aria-pressed={row.item.id === selected?.item.id} onClick={() => { if (mayLeave()) { setSelected(row); setShowList(false); setDraft({ ...row.item }); setMessage(''); } }}><strong>{row.item.title || row.item.name}</strong><small>{row.item.language ? String(row.item.language).toUpperCase() + ' · ' : ''}{row.item.type || row.item.slug || `Nr. ${row.item.chapter_number}`}</small>{area === 'books' && <span class={`cms-workspace-pill ${Number(row.item.is_published) ? 'is-on' : ''}`}>{Number(row.item.is_published) ? 'Veröffentlicht' : 'Entwurf'}</span>}</button></li>)}
  </ul></div></details></section><section class="cms-workspace-card music-cms-editor" aria-label="Inhalt bearbeiten"><div class="cms-workspace-card-body">{!draft ? <p>Inhalt auswählen oder neu anlegen.</p> : <form onSubmit={event => {
    event.preventDefault(); perform(async () => {
      const item = Object.fromEntries(collection.fields.map(f => [f.name, draft[f.name] ?? null]));
      const result = await request(selected ? `${area}/${selected.item.id}` : area, selected ? 'PUT' : 'POST', { item, revision: selected?.revision });
      setSelected(result); setDraft({ ...result.item }); await load(area); setMessage('Gespeichert.');
    });
  }}><h2>{selected ? 'Inhalt bearbeiten' : 'Neuer Inhalt'}</h2>
    {area === 'books' && <p>„Veröffentlicht“ steuert die öffentliche Buchseite. „Im Bücher-Menü anzeigen“ steuert die Links in Kopf- und Fußbereich. Kleinere Reihenfolgen erscheinen zuerst. Ohne eigene Menübezeichnung wird der Buchtitel verwendet.</p>}
    <fieldset disabled={busy}>
    {collection.fields.map(field => {
      const name = field.name; const value = draft[name] ?? ''; const update = (v: string) => setDraft({ ...draft, [name]: v });
      const options = links[name] ? collection.choices[links[name]].map(row => [String(row.id), row.label]) : name === 'language' ? [['de','DE – Deutsch'],['en','EN – Englisch'],['fr','FR – Französisch']] : name === 'soundtrack_source' ? [['series','Aus gewählter Serie'],['english_book','Englischer Bestandssoundtrack (10 Titel)']] : name === 'type' ? [['song','Song (Buch-Soundtrack)'],['audiobook','Hörbuch'],['gard7','GARD 7'],['single','Single'],['ep','EP'],['album','Album'],['chapter_audio','Audio-Kapitel']] : ['featured','is_published','show_in_navigation'].includes(name) ? [['0','Nein'],['1','Ja']] : null;
      return <label>{labels[name] || name}{options ? <select value={String(value)} required={!!field.notnull} onChange={event => update(event.currentTarget.value)}>{!field.notnull && <option value="">Keine Zuordnung</option>}{options.map(([id, label]) => <option value={id}>{label}</option>)}</select> : longText.has(name) ? <textarea rows={6} value={value} onInput={event => update(event.currentTarget.value)} /> : <input value={value} required={!!field.notnull} type={field.type.includes('INT') ? 'number' : name === 'release_date' ? 'date' : 'text'} min={field.type.includes('INT') ? 0 : undefined} onInput={event => update(event.currentTarget.value)} />}</label>;
    })}
    {collection.fields.some(f => ['cover', 'image'].includes(f.name)) && <label>Bild hochladen (JPEG, PNG, WebP; max. 8 MiB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => {
      const file = event.currentTarget.files?.[0]; if (!file) return;
      perform(async () => {
        if (file.size > 8 * 1024 * 1024) throw new Error('Bild ist größer als 8 MiB.');
        const form = new FormData(); form.set('image', file);
        const response = await fetch(`${getApiBase()}/cms/upload`, { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: form, signal: AbortSignal.timeout(30000) });
        const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Upload fehlgeschlagen.');
        const field = collection.fields.find(f => ['cover', 'image'].includes(f.name))!;
        setDraft({ ...draft, [field.name]: result.url }); setMessage('Bild hochgeladen. Zum Zuordnen den Inhalt speichern.');
      });
    }} /></label>}
    <div class="music-cms-actions"><button type="submit" class="cms-workspace-button cms-workspace-button-primary">Speichern</button><button type="button" onClick={() => { if (mayLeave()) { setDraft(null); setSelected(null); } }}>Schließen</button>{selected && <button type="button" onClick={() => {
      if (window.confirm('Diesen Inhalt dauerhaft löschen? Verknüpfte Inhalte müssen zuvor getrennt werden.')) perform(async () => { await request(`${area}/${selected.item.id}`, 'DELETE', { revision: selected.revision }); setDraft(null); setSelected(null); await load(area); setMessage('Gelöscht.'); });
    }}>Löschen</button>}</div>
  </fieldset></form>}</div></section><aside class="cms-workspace-card cms-workspace-preview" aria-label="Inhaltsvorschau">
    <header class="cms-workspace-preview-head"><div><i aria-hidden="true" /><strong>Inhaltsvorschau</strong></div><div class="cms-workspace-devices" role="group" aria-label="Vorschaubreite">
      <button type="button" class={previewWidth === 'desktop' ? 'is-active' : ''} aria-label="Desktop-Vorschau" aria-pressed={previewWidth === 'desktop'} onClick={() => setPreviewWidth('desktop')}>▱</button>
      <button type="button" class={previewWidth === 'mobile' ? 'is-active' : ''} aria-label="Mobil-Vorschau" aria-pressed={previewWidth === 'mobile'} onClick={() => setPreviewWidth('mobile')}>▯</button>
    </div></header>
    <p class="cms-workspace-preview-note">Gespeicherter Inhalt · Website-Gestaltung{dirty ? ' · Änderungen zuerst speichern' : ''}</p>
    {selected ? <CmsPreviewFrame area={area} id={selected.item.id!} revision={selected.revision} mobile={previewWidth === 'mobile'} reload={previewReload} title={String(selected.item.title || selected.item.name)} /> : <div class="cms-workspace-preview-area"><p class="music-cms-empty">Wähle einen gespeicherten Inhalt für die Vorschau aus.</p></div>}<footer class="cms-workspace-preview-foot"><span>{selected ? (area === 'books' ? (Number(selected.item.is_published) ? 'Veröffentlicht' : 'Entwurf') : 'Gespeicherter Inhalt') : 'Noch kein Inhalt ausgewählt'}</span><button type="button" disabled={!selected} onClick={() => setPreviewReload(value => value + 1)}>Aktualisieren ↻</button></footer>
  </aside></div>}<footer class="cms-workspace-footer"><span>FREIBERGER.MUSIC · CMS</span><span>Inhalte pflegen. Geschichten erzählen.</span></footer></main></div></div>;
}
