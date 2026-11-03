# Walkthrough: freiberger.music — Entwicklungsdokumentation

Umfassende Dokumentation aller umgesetzten Meilensteine, Architektur-Entscheidungen und technischer Lösungen für **freiberger.music** (Audiovisuelles Künstlerarchiv & Digitales Label).

---

## 1. Meilenstein A: Audio-Player & Ägäis-Ambient-Soundscape

### 🌊 Prozeduraler Ägäis-Ambient-Generator (`frontend/src/player/ambientSound.ts`)
- **Keine Ladezeiten / Null Netzwerk-Traffic:** Erzeugt authentische Brandungswellen und Küstenbrisen direkt im Browser über die native **Web Audio API**.
- **Wellen-Modulation:** Ein Brown-/Pink-Noise-Generator wird von einem Niederfrequenz-Oszillator (LFO ~8,5s Zyklus) durch einen Tiefpassfilter geführt, sodass das Anschwellen und Zurückweichen von Meerwasser täuschend echt simuliert wird.
- **Kombinierbar mit Musik:** Läuft wahlweise autark beim Stöbern im Buch/auf den Inseln oder als sanfte meditative Untermalung unter den Songs.
- **Sanfte Fades:** Ein- und Ausblenden erfolgt mit sanften 1,5s Ramp-Kurven.

### 🎛️ Player-Steuerung & Timeline-Scrubber (`frontend/src/components/PlayerBar.tsx`)
- **Vor/Zurück-Buttons (`⏮` / `⏭`):** Schaltet flüssig durch alle 10 offiziellen Soundtrack-Titel.
- **Interaktiver Fortschrittsbalken (Scrubber):** Zeigt aktuelle Spielzeit (`00:00`) und Gesamtlaufzeit (`07:27`), reagiert auf Klick und Ziehen, und visualisiert den Verlauf in edlem Sandgold (`--accent-sand`).
- **Ambient-Button `[ 🌊 Ägäis Ambient ]`:** Direkt rechts in der Playerleiste integriert. Leuchtet im Aktivzustand mit einem pulsierenden Leuchtturm-Signal (`--accent-turquoise`).

---

## 2. Meilenstein B: Interaktive Ägäis- & Griechenland-Vektorkarte

### 🗺️ Interaktives SVG-Kartenmodul (`frontend/src/components/GreeceMap.tsx`)
- **Design & Ästhetik:** Dunkel gehaltene nautische Ägäis-Karte mit Tiefenrelief-Glow, Koordinatennetz (35°N–39°N, 21°E–27°E) und dezenten Wasserzeichen (`ΑΙΓΑΙΟ ΠΕΛΑΓΟΣ · AEGEAN SEA`, `ΙΟΝΙΟ`, `ΚΡΗΤΙΚΟ`).
- **Genaue Geokoordinaten für alle 8 Schauplätze:**
  - **Naxos** (Portara, Kykladen)
  - **Santorini** (Caldera & Akrotiri)
  - **Athen** (Akropolis & Plaka)
  - **Zakynthos** (Marathonisi, Ionisches Meer)
  - **Kreta** (Samaria-Schlucht, Knossos)
  - **Rhodos** (Altstadt & Helios)
  - **Kos** (Hippokrates & Asklepieion)
  - **Korfu** (Korkyra, Ionischer Norden)

### 📡 Leuchtende Radar-Baken & Atmosphären-Synchronisation
- **Hover & Klick:**
  - Jede Insel besitzt ein pulsierendes Radar-Signal in ihrer Schauplatz-Akzentfarbe.
  - Beim Überfahren (Hover) oder Anklicken wechselt das gesamte Umgebungslicht der Website (`AmbientStage.tsx`) synchron zur jeweiligen Inselfarbe (z. B. Türkis bei Naxos, Vulkanrot bei Santorini, Gold bei Athen).
  - Ein schwebendes Glas-Kärtchen öffnet sich mit Koordinaten, griechischem Namen, Zitat/Tagline und dem zugehörigen Soundtrack.
  - **1-Click Play:** Direkter Start des Tracks über `▶ Song abspielen`.

### 🧭 Integriert auf Schauplatz- & Startseite
- **Auf `/places` (`PlacesPage.tsx`):** Ansichtsumschalter zwischen `[ 🗺️ Interaktive Ägäis-Karte ]` und `[ ⊞ Kachel-Raster ]` inklusive Direkt-Wegweiser-Chips für jede Insel.
- **Auf der Startseite (`PlaceExplorer.tsx`):** Nahtlos umschaltbar zwischen Karte und Kacheln.

---

## 3. Deployment & DomainFactory Hosting

- **Automatische HTTP-to-HTTPS Weiterleitung:** In `.htaccess.domainfactory` mit 301-Redirect und Schutz der SQLite-Datenbank.
- **Social Sharing:** OpenGraph- & Twitter-Card-Metatags für WhatsApp, Facebook, iMessage & Instagram.
- **Deploy-Paketierer (`scripts/package-domainfactory.js`):**
  - Befehl: `npm run package` (im `frontend/`-Ordner)
  - Erstellt automatisch das fertige Upload-Verzeichnis `deploy-domainfactory/` und das ZIP-Archiv `deploy-domainfactory.zip` (616 KB).

---

## 4. YouTube-Player Steuerung & Synchronisation

### 🎯 Ursache der nicht reagierenden Steuerungsbuttons
Bisher waren die Buttons in der fixierten unteren PlayerBar (`⏮`, `▶` / `⏸`, `⏭`, Scrubber) nur für HTML5-Audio-Dateien (MP3) ausgelegt. Da alle 10 Soundtrack-Titel als audiovisuelle YouTube-Streams (`youtube_id`) hinterlegt sind, schaltete ein Klick auf `▶` lediglich ein internes Boolean um, ohne den YouTube-Player anzusteuern.

### 🛠️ Durchgeführte Optimierungen:
1. **YouTube IFrame API Integration (`YouTubeFacade.tsx`):**
   - Parameter `enablejsapi=1` und Absender-`origin` zum YouTube-Embed-URL hinzugefügt.
   - Eindeutige ID `id="freiberger-youtube-iframe"` sowie `key={youtubeId}` für sauberen Instanzwechsel vergeben.
   - Handshake über `{"event":"listening"}` beim Laden des Iframes eingerichtet.
2. **Bidirektionale PostMessage-Steuerung (`playerStore.ts`):**
   - `sendYouTubeCommand(func, args)` implementiert:
     - `playVideo`: Startet oder setzt das Video fort.
     - `pauseVideo`: Pausiert das Video nahtlos im Hintergrund oder im Drawer.
     - `seekTo`: Springt sekundengenau an die im Scrubber ausgewählte Position.
   - Event-Listener für `window.onmessage` hört auf YouTube `infoDelivery`- und `onStateChange`-Events:
     - Spielzeit (`currentTime`) und Gesamtdauer (`duration`) synchronisieren die Zeitanzeige und den Fortschrittsbalken in Echtzeit.
     - Player-Status (`1` = Playing, `2` = Paused, `0` = Ended).
     - Bei Video-Ende (`playerState === 0`) wird automatisch zum nächsten Track überblendet (`playNextTrack()`).
3. **Automatisches Vorbelegen & Drawer-Öffnen:**
   - Beim Seitenaufruf wird automatisch Track 1 ("Was das Meer bewahrte") im Store initialisiert, inklusive korrekter Laufzeit (`07:05`).
   - Klickt der Besucher unten auf `▶`, öffnet sich automatisch der PlayerDrawer, der Stream wird aktiviert und startet die Wiedergabe ohne weitere Zwischenklicks.
   - Schließen des Drawers pausiert die Wiedergabe nicht – die Buttons `⏮`, `⏸`, `⏭` steuern das Video auch bei geschlossenem Drawer im Hintergrund weiter.

---

## 5. Cover-Darstellung auf 16:9 Breitbild angepasst

### 🎯 Ursache der abgeschnittenen Cover
Bisher war der CSS-Container für Song-Cover (`.card-cover-box` und `.now-playing-cover-wrapper`) auf ein quadratisches Format (`aspect-ratio: 1 / 1`) mit `object-fit: cover` eingestellt (analog zu traditionellen quadratischen CD-/Vinyl-Hüllen).
Da alle Artworks und Video-Thumbnails von Werner Freiberger im filmischen **16:9 Breitbildformat** (1920x1080) angelegt sind, hat der Browser links und rechts ca. 40% des Bildinhalts abgeschnitten, wodurch Texte wie *"BEVOR DAS LICHT..."* oder *"DIE STADT, DIE MICH SAH"* am linken Rand gekappt wurden.

### 🛠️ Durchgeführte Optimierungen:
1. **16:9 Container-Verhältnis (`frontend/src/styles/main.css`):**
   - `.card-cover-box`: Auf `aspect-ratio: 16 / 9;` umgestellt.
   - `.now-playing-cover-wrapper`: Auf `aspect-ratio: 16 / 9;` umgestellt.
   - `.release-card`: Kartenbreite im Slider auf edle `320px` (Höhe 180px) optimiert.
   - `.card-track-number`: Positionierung harmonisch auf `top: 10px; left: 10px;` angepasst.
   - `.player-mini-cover`: Mini-Vorschau in der PlayerBar auf `58px x 33px` (16:9) angepasst.
2. **Listenansicht im Buch-Bereich (`BookPage.tsx`):**
   - Thumbnail in der Tabellenzeile auf `58px x 33px` (16:9) umgestellt.
3. **Ergebnis:**
   - Alle Cover, Titel-Typografien und Bildkompositionen sind nun vollständig, randscharf und unbeschnitten sichtbar.

---

## 6. Impressum, Datenschutz & Cookie-Recht (TDDDG / DSGVO)

### 🍪 Braucht man in Deutschland einen Cookie-Akzepter / Cookie-Banner?
**Nein! Für `freiberger.music` ist KEIN Cookie-Banner erforderlich.**
- **Rechtsgrundlage (§ 25 TDDDG & DSGVO):** Ein Cookie-Banner ist nur dann gesetzlich vorgeschrieben, wenn *nicht-technisch notwendige Cookies* (z. B. Google Analytics, Facebook/Meta-Pixel, Werbe-Tracker, Affiliate-Cookies) gesetzt werden.
- **Warum freiberger.music befreit ist:**
  1. Es werden **keinerlei Marketing- oder Tracking-Cookies** eingesetzt.
  2. Die UI-Präferenzen (z. B. Sprache `de`/`en`) werden im lokalen Browserspeicher (*Local Storage*) rein funktional nach § 25 Abs. 2 Nr. 2 TDDDG gespeichert.
  3. YouTube-Videos sind über eine **2-Click-Lösung** geschützt: Externe Verbindungen und YouTube-Cookies werden erst nach nutzerinitiiertem Klick geladen.
  4. Der Ägäis-Ambient-Sound wird rein lokal über die Web Audio API generiert.
- **Großer Vorteil:** Die Website begrüßt Besucher ohne lästige Popups, wirkt extrem edel und lädt maximal schnell!

### 🏛️ Integriertes Impressum & Datenschutzerklärung
- **Neue Seite:** [`frontend/src/pages/LegalPage.tsx`](file:///C:/Dev/freiberger-music/frontend/src/pages/LegalPage.tsx) (Route: `#/impressum` oder `#/datenschutz`)
  - **Reiter Impressum:** Pflichtangaben nach § 5 DDG, Urheberrechtshinweise für Musik, Texte und Bildwerke, Disclaimer für externe Links.
  - **Reiter Datenschutz:** Transparente DSGVO-Erklärung über Hosting bei DomainFactory, 2-Click-YouTube-Lösung, Local Storage und Betroffenenrechte.
- **Neuer Footer:** [`frontend/src/components/Footer.tsx`](file:///C:/Dev/freiberger-music/frontend/src/components/Footer.tsx) mit Navigation, Marken-Claim, Datenschutz-Gütesiegel (*100% Tracking- und werbefrei*) und direktem Link zum Impressum.
- **Anbieterkennzeichnung hinterlegt:** Werner Freiberger, Am Moränenhügel 7, 83558 Maitenbeth.


