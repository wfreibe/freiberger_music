# CMS- und Deployment-Migration

Aktueller Ablauf: [Migration und Deployment](docs/MIGRATION_UND_DEPLOYMENT.md).
Die folgenden bisherigen Projektnotizen dokumentieren den alten Studio-/ZIP-Ablauf.

# FREIBERGER · music · stories · places · memories

> **Audiovisuelles Künstlerarchiv & Digitales Label**  
> Konzipiert und entwickelt für Werner Freiberger.

---

## 1. Architektur & Technologie-Stack

- **Frontend:** Preact 10 + TypeScript + Vite + `@preact/signals`
- **Design:** Deep Aegean / Future Garage / Editorial Modernism (`#0b0c0e`, `#111315`, `#e8e5de`, Sandgold `#d4b483`, Ägäis-Türkis `#387780`, Vulkanrot `#c75d4d`)
- **Web Audio Ambient Engine ([`ambientSound.ts`](frontend/src/player/ambientSound.ts)):** Prozeduraler Generator für Meeresbrandung und Küstenwind direkt im Browser (Web Audio API, Null Netzwerk-Traffic).
- **Interaktive Griechenland-Karte ([`GreeceMap.tsx`](frontend/src/components/GreeceMap.tsx)):** Nautische Vektor-SVG-Karte mit dynamischen Leuchtfeuer-Baken, synchronem Umgebungslicht-Wechsel und 1-Click-Soundtrack-Wiedergabe.
- **Player & Scrubber ([`PlayerBar.tsx`](frontend/src/components/PlayerBar.tsx)):** Persistenter Player mit Vor-/Zurück-Tasten, Fortschrittsleiste (Scrubber), Zeitanzeige und zuschaltbarem Ägäis-Ambient-Sound.
- **Mehrsprachigkeit:** Echtzeit-Umschaltung Deutsch / Englisch / Französisch (`DE | EN | FR`) via Signals. Beim Öffnen eines deutschen, englischen oder französischen Buchlinks wird DE, EN beziehungsweise FR vorausgewählt, auch bei abweichender gespeicherter Auswahl. Anschließend ist manuelles Umschalten möglich. Andere Seiten behalten die gespeicherte Sprache. Die gewählte Buchausgabe und die Sprache der Medien bleiben unverändert. Längere redaktionelle Inhalte bleiben in der vorhandenen Originalsprache, sofern keine Übersetzung hinterlegt ist.
- **Backend API:** Schlankes PHP 8 (REST API) via PDO SQLite im Ordner `api/`.
- **Datenbank:** SQLite (`storage/freiberger.sqlite`), geschützt vor direktem Webzugriff via `.htaccess`.
- **Studio CMS:** `/studio` (Passwortgeschützte Verwaltung von Releases, Orten, Buchkapiteln – Einrichtung ausschließlich per privatem CLI-Prozess).
- **Deployment:** Statische Produktiv-Dateien + PHP + SQLite. Kein Node.js-Server auf dem Host erforderlich.

---

## 2. Die offizielle Reihenfolge der 10 Soundtrack-Songs

| Track | Titel | Schauplatz | YouTube-ID | Dauer | Tempo |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **01** | **Bevor das Licht einen Namen hatte** | Delos / Delphi / Athen | `dvLEsXrZXJ8` | 07:27 | 134 BPM |
| **02** | **Das Meer, das uns bewahrte** | Zakynthos & Marathonisi | `d87nefPuDgU` | 07:05 | 124 BPM |
| **03** | **Wo das Grün uns wiederfand** | Korfu & Korkyra | `5WFzRxamMPs` | 06:11 | 118 BPM |
| **04** | **Die Stadt, die mich sah** | Athen | `3-_lDTXqijw` | 07:51 | 124 BPM |
| **05** | **Der Himmel kannte unsere Namen** | Kreta | `ZSzFRGumV9Q` | 06:56 | 127 BPM |
| **06** | **Wo die Asche atmet** | Santorini & Akrotiri | `YTb6bBPs7sc` | 06:53 | 125 BPM |
| **07** | **Als der Horizont uns wiedersah** | Naxos | `3iGRwql0ug8` | 06:48 | 129 BPM |
| **08** | **Bis unter dem Wasser wieder Land erscheint** | Rhodos & Helios | `pVy3cQxnpm0` | 06:12 | 129 BPM |
| **09** | **Der Puls, der uns verband** | Kos & Nisyros | `gonZwH0MBlU` | 05:51 | 126 BPM |
| **10** | **Was das Meer bewahrte** | Naxos / Ägäis | `UbpEoFPuQEo` | 06:10 | 129 BPM |

---

## 3. Buch & QR-Code-Integration

- **Gedrucktes Buch:** *Die Orte, die uns sahen* (Werner Freiberger)
- **Zielseite des QR-Codes:** [`https://freiberger.music/die-orte-die-uns-sahen`](https://freiberger.music/die-orte-die-uns-sahen)
- Zeigt zuerst die **10 Soundtrack-Songs** (wahlweise als Karten oder kompakte Liste) und im zweiten Tab das **vollständige Hörbuch (11 Kapitel + Epilog)**.

---

### Französische Buchausgabe

- **Barcode-Ziel:** https://freiberger.music/les-lieux-qui-nous-ont-vus
- **Navigation:** BÜCHER / BOOKS → LES LIEUX QUI NOUS ONT VUS.
- **Videos:** Dieselben deutschen Songs aus der API wie auf der deutschen Buchseite, mit Karten-/Listenansicht und Vorschaubildern.
- **Französisches Hörbuch:** Coming soon.

### Englische Buchausgabe

- **Barcode-Ziel:** https://freiberger.music/the-places-that-saw-us
- **Navigation:** BÜCHER / BOOKS → DIE ORTE, DIE UNS SAHEN / THE PLACES THAT SAW US. Die Kartenansicht bleibt unter Orte / Locations erreichbar.
- **Soundtrack:** Zehn Videos aus https://www.youtube.com/playlist?list=PLVWqVtOXwCCE, mit Karten-/Listenansicht und dem gemeinsamen Player.
- **Datenquelle:** Titel, Reihenfolge, Video-IDs und Laufzeiten sind in `frontend/src/data/englishBookSoundtrack.ts` hinterlegt (öffentlich geprüft am 02.10.2026). Änderungen an der Playlist müssen dort nachgeführt werden.
- **Englisches Hörbuch:** Coming soon.
- **epubli:** Kauf-Links für Buch und E-Book werden ergänzt, sobald sie vorliegen.

---

## 4. Wichtige Befehle für die Entwicklung

Alle Befehle werden im Verzeichnis `frontend/` ausgeführt:

```bash
cd frontend

# 1. Lokaler Entwicklungsmodus (PHP-Backend + Vite mit Hot Module Reloading)
npm run dev

# 2. Produktions-Build erstellen & nach Root synchronisieren
npm run build

# 3. Komplettes DomainFactory-Paket schnüren (Ordner + ZIP)
npm run package
```

---

Die Vorschau läuft unter `http://localhost:3000`. `npm run dev` startet PHP auf `127.0.0.1:8080` und Vite gemeinsam; beide werden beim Beenden gestoppt. PHP mit PDO SQLite muss im PATH verfügbar sein. Ein laufendes XAMPP/Apache ist für die Vorschau nicht erforderlich. Die Ports 3000 und 8080 müssen frei sein.

## 5. Deployment auf DomainFactory (DF)

### Upload per FileZilla:
1. Öffne FileZilla und verbinde dich mit deinem DomainFactory-FTP-Konto.
2. Navigiere rechts in das Verzeichnis deiner Domain `freiberger.music` (z. B. `/webseiten/freiberger.music/`).
3. Navigiere links zu:
   ```
   C:\Dev\freiberger-music\deploy-domainfactory
   ```
4. Markiere alle 7 Elemente (`.htaccess`, `index.html`, `api/`, `assets/`, `covers/`, `storage/`, `studio/`) und lade sie hoch.
5. Stelle sicher, dass der Ordner `storage/` auf dem Server die Berechtigung `755` hat.

*(Alternativ: Lade die Datei `deploy-domainfactory.zip` im WebFTP von DomainFactory hoch und klicke auf „Archiv entpacken“).*

---

## 6. Studio-CMS Zugang
- **URL lokal:** [http://localhost/freiberger-music/studio/](http://localhost/freiberger-music/studio/)
- **URL live:** `https://freiberger.music/studio/`
- **Passwort:** `[entfernt]` (konfigurierbar in `studio/auth.php`)
- Alle Änderungen im Studio werden direkt in `storage/freiberger.sqlite` gespeichert und sind ohne Rebuild sofort live.


## Startseite Musik (Oktober 2026)

Die Startseite zeigt Musikvideos und Hörbuchkapitel als Cover-Katalog. Navigation: Musik / Music / Musique; Überschrift: Musik & Hörbücher. Filter: alle Inhalte, Musik, Hörbücher, tatsächliche Inhaltssprache sowie Suche nach Titel oder Ort. Die Oberflächensprache ist vom Inhaltsfilter unabhängig.

`frontend/src/data/mediaCatalog.ts` führt die API-Veröffentlichungen und die englischen Buchsongs zusammen und entfernt doppelte Video-IDs. Aktuell: 36 Titel, davon 24 Musikvideos und 12 Hörbuchkapitel; 22 deutschsprachige und 14 englischsprachige Inhalte. Die vier GARD-7-Videos sind laut Betreiber englischsprachig. Unbekannte zukünftige Inhalte werden als nicht zugeordnet angezeigt; Sprachzuordnungen werden in diesem Modul gepflegt. Hörbuchkapitel bleiben in Kapitelreihenfolge. Die Wiedergabeliste wird beim Start eines Titels aus den gefilterten Ergebnissen gebildet.

Die Buchseiten mit Barcode-Links bleiben eigene Zugänge unter Bücher. Tests: `node --test tests/i18n.test.mjs tests/media-catalog.test.mjs`.


## Studio-Korrektur (3. Oktober 2026)

Das Release-Formular enthält nun Inhaltstyp und Playlist-ID. Fehlende Felder beim Bearbeiten behalten die gespeicherten Werte; zuvor wurde der Typ unbemerkt auf `single` gesetzt und die Playlist-ID geleert. Vollständige YouTube-Video-Links werden beim Speichern validiert und zu IDs normalisiert. Die API unterstützt außerdem bereits gespeicherte vollständige Links ohne Datenbankänderung.

Bereits verschwundene Buch-Songs im Studio erneut als **Song (Buch-Soundtrack)** speichern. Für „Als der Horizont uns wiedersah“ lautet die vom Betreiber angegebene neue Video-ID `elMGltCaFfM`. Der Live-Datensatz wurde nicht geändert oder verifiziert. Für dieses Update `deploy-domainfactory/` bzw. `deploy-domainfactory.zip` verwenden: ohne Datenbank, damit die aktuellen Online-Bearbeitungen erhalten bleiben. Das ältere Full-Paket ist nicht für dieses Update vorgesehen.

Regressionstests: `php tests/studio-release.test.php` (isolierte SQLite-Datenbank im Arbeitsspeicher) und `node --test tests/i18n.test.mjs tests/media-catalog.test.mjs`.


### Ergänzung: bereits betroffene Buch-Songs

Die deutsche und französische Buchseite berücksichtigen jetzt neben `song` auch `single` innerhalb der Serie `the-greece-chapters`. Dadurch werden durch den früheren Studio-Fehler bereits umgestellte Einträge ohne Datenbankänderung wieder angezeigt. Mit den öffentlichen Live-Daten geprüft: vorher 9, danach 10 Songs einschließlich `als-der-horizont-uns-wiedersah` mit `elMGltCaFfM`. Neues Update-Paket ohne Datenbank hochladen; eine manuelle Typkorrektur ist für die Buchanzeige damit nicht mehr erforderlich. Regressionstest: `node --test tests/book-soundtrack.test.mjs`.


## Hörbücher – Neuinstallation vom 11. Oktober 2026

Die zwölf deutschen Hörbuchkapitel verwenden jetzt Playlist `PLYjciFHvZoyU`; zwölf französische Kapitel aus `PLbf_CjWtjwr0` sind ergänzt. Beide Ausgaben werden auf der Website nach Kapitelnummer 1–12 einschließlich Epilog sortiert. Die französische Buchseite zeigt das Hörbuch statt Coming soon; die Gesamtübersicht bietet Französisch als Inhaltssprache. Deutsch und Französisch bleiben auf ihren Buchseiten getrennt. Aktuell 48 Titel: 24 Musikvideos und 24 Hörbuchkapitel (12 DE, 12 FR).

Verifizierte Playlist-Metadaten: `scripts/audiobook-playlists.json`; lokaler Import: `scripts/import-audiobook-playlists.py`. Vor erneutem Import Datenbank sichern. `api/schema.sql` wurde für eine frische Installation aktualisiert. Die frühere Video-Korrektur `elMGltCaFfM` für Als der Horizont uns wiedersah ist auch im lokalen Installationsbestand erhalten.

Für die ausdrücklich gewünschte vollständige Neuinstallation den Inhalt von `deploy-domainfactory-full/` oder `deploy-domainfactory-full.zip` verwenden, inklusive `storage/freiberger.sqlite`. `dist/` enthält nur den aktuellen Frontend-Build. Datenbank und früheres Full-Paket sind unter `.deployment-backups/` gesichert. Noch kein Upload durchgeführt.

Prüfungen: 14 Node-Tests, PHP-Studio-Regressionstest, TypeScript/Vite-Build, frische Installation des SQL-Seeds, DB-Integrität, Fremdschlüssel sowie alle 24 Kapitel-IDs und Laufzeiten im vollständigen Installationspaket. Browser-Vorschau in dieser Sitzung wegen lokaler Verbindungsblockade nicht überprüfbar.
