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
