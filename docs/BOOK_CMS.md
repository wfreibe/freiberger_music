# Bücher und Menü im CMS

Unter `/cms` → **Bücher** werden die deutsche, englische und französische Ausgabe
als eigene Einträge verwaltet. Migration 103 ergänzt die vorhandene Datenbank um
die neuen Felder und die bisherigen EN-/FR-Seiten. Bestehende deutsche Buchinhalte,
Kapitel, Veröffentlichungen und Medien bleiben erhalten. Erneute Migrationsläufe
überschreiben spätere CMS-Änderungen nicht.

- **Sprache der Buchausgabe:** DE, EN oder FR. Bestimmt die Seitenvorlage und die
  anfängliche Sprache beim Öffnen. Besucher können die Oberflächensprache weiterhin umschalten.
- **Titel, Untertitel, Autor, Beschreibung:** Inhalte der jeweiligen Buchseite.
  Titel werden wie bisher in Versalien dargestellt. Leere EN-/FR-Beschreibungen
  verwenden weiterhin die vorhandenen übersetzten Einführungstexte.
- **Menübezeichnung:** Beschriftung im Bücher-Menü und im Fußbereich; leer bedeutet Buchtitel.
- **Reihenfolge:** Kleinere Zahlen stehen zuerst. Vorgabe: DE 10, EN 20, FR 30.
- **Im Bücher-Menü anzeigen:** Steuert die Links in Kopf- und Fußbereich.
  Ein ausgeblendetes, veröffentlichtes Buch bleibt über seinen Direktlink erreichbar.
- **Veröffentlicht / öffentlich erreichbar:** Bei Nein wird das Buch weder im
  öffentlichen Menü noch über die öffentliche Buch-API oder Direktseite angezeigt.
  Es bleibt im CMS bearbeitbar.
- **URL-Name:** Adresse der Buchseite, beispielsweise `/the-places-that-saw-us`.
  Änderungen ändern auch die Adresse; vorhandene QR-Codes auf diese Adresse
  sollten deshalb vor einer Änderung berücksichtigt werden. Die bestehende deutsche
  Alias-Adresse `/die-orte-die-mich-sahen` bleibt für die kanonische DE-Ausgabe erhalten.

Die Medien können über **Serie für den Soundtrack** und **Serie für das Hörbuch**
zugeordnet werden. Die bisherigen DE-/FR-Zuordnungen werden übernommen. EN verwendet
standardmäßig den vorhandenen englischen Bestandssoundtrack mit zehn Titeln; alternativ
kann eine im CMS gepflegte Serie ausgewählt werden. Sprachwahl übersetzt keine Medien.

Nach dem Speichern die öffentliche Website neu laden oder deren Browserfenster erneut
aktivieren. Menü und Buchseiten laden die aktuellen veröffentlichten Buchdaten aus der API.
Die bestehenden öffentlichen Styles und Layouts bleiben erhalten.

Prüfung: `npm test`, anschließend `npm run package:deploy`,
`MUSIC_TEST_PACKAGE=dist-packages/freiberger-music-deploy.zip node --test tests/cms.test.mjs`
sowie `node --test tests/private-preparation.test.mjs`. Tests verwenden synthetische
Daten. Das bestehende Deployment führt Migrationen weiterhin mit `--without-backup` aus.

## Buchlinks und Der rote Schal

Migration 104 ergänzt DE, EN und FR des neuen Buchs sowie vier optionale HTTPS-Linkfelder: Buchkauf, Songs-Playlist, deutsches Hörbuch und Film. Der epubli-Suchlink wird einmalig für bestehende Bücher eingetragen. Neue Bücher können den Link im CMS erhalten. Alle Links sind dort änderbar oder entfernbar.

Bücher mit Songs-Playlist ohne zugeordnete Soundtrack-Serie verwenden eine Buchseite mit Links statt leerer Titellisten. Die YouTube-Links öffnen extern; es werden keine ungeprüften Tracknamen oder Kapitel importiert. Der Hörbuchlink ist in allen drei Ausgaben als deutsch gekennzeichnet. Beschreibungen und Cover können im CMS nachgetragen werden.

## Direkt abspielbare Medien für Der rote Schal

Migration 105 importiert den öffentlichen YouTube-Stand vom 3. November 2026: sieben französische Songs und fünf deutsche Hörbuchkapitel. Sie legt zwei Serien an und ordnet diese den drei Buchausgaben zu, sofern dort noch keine Medienserien gepflegt sind. Vorhandene Datensätze werden nicht überschrieben. Die deutschen Kapitel werden dem deutschen Buch zugeordnet; alle Ausgaben verwenden dieselbe Hörbuchserie.

Die Buchseiten nutzen damit die vorhandenen Song-/Hörbuchansichten und den Website-Player. Unter Musik & Hörbücher und Alben & Serien lassen sich Videos, Titel und Zuordnungen weiter pflegen. Neue YouTube-Einträge werden nicht automatisch synchronisiert. Der Film bleibt als externer Link bestehen.

## CMS-Vorschau und Redaktionsoberfläche

Der Redaktionsbereich verwendet Seitenleiste, Kopfzeile, Statusanzeige und Inhaltskarten nach dem Vorbild von freiberger.design. Nach Auswahl eines Eintrags klappt die Inhaltsliste zusammen; über „Inhalt auswählen“ kann ein anderer Eintrag gewählt werden.

Die Desktop-Vorschau rendert mit 1280 Pixeln, die Mobil-Vorschau mit 375 Pixeln (jeweils einschließlich Browser-Scrollleiste). Die Ansicht wird auf den verfügbaren Platz skaliert. Buchseiten verwenden dieselben Komponenten wie öffentlich; Musik, Kapitel, Orte und Serien zeigen die gespeicherten Inhalte mit den Website-Styles und dem vorhandenen Medien-Slider. Die Vorschau ist eine Inhaltskontrolle, die Navigation innerhalb des Rahmens ersetzt keinen öffentlichen Website-Besuch.

Die Vorschau zeigt ausschließlich gespeicherte Werte. Ungespeicherte Änderungen werden markiert. Speichern lädt die Vorschau neu; „Aktualisieren“ lädt sie bei Bedarf erneut. Neue Einträge erhalten nach dem ersten Speichern eine Vorschau. Unveröffentlichte Bücher können angemeldet angesehen werden, ohne sie öffentlich freizugeben. Der Lese-Endpunkt `/api/cms/preview/{Bereich}/{ID}` erfordert die bestehende CMS-Anmeldung und liefert `Cache-Control: no-store`. Es gibt keine Datenmigration.
