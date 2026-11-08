# CMS-Übernahme aus freiberger.design

Lokale Umsetzung auf Grundlage des am 8. November 2026 vorhandenen Referenzcodes (Git-Stand 7110ffb). Das Referenzprojekt wurde ausschließlich gelesen. Ein Deployment ist ein gesonderter Schritt.

## Übernommene Funktionen

- Gemeinsame Inhaltsliste für Text, Bild mit Text, Slideshow, Akkordeon, YouTube, Audio und Links; auf-/zuklappbar, sortierbar, ausblendbar und einzeln entfernbar.
- Formatierter Texteditor mit HTML-Ansicht; HTMLPurifier 4.19.1 im Backend und DOMPurify 3.4.17 im Browser.
- Bildformate, Ausrichtung, Breite und Fokus; Bilder über die vorhandene Upload-API. Die Dateien werden beim Hochladen angelegt, ihre Zuordnung erst beim Speichern übernommen.
- Ungespeicherte Desktop-/Mobilvorschau, die dieselben Darstellungskomponenten wie die Website verwendet. Der Entwurf wird vor der Anzeige serverseitig validiert; POST /api/cms/preview schreibt keine Inhalte. Daneben bleibt der gespeicherte Stand wählbar.
- Einklappbare Grunddaten, Veröffentlichungs-/Menüfelder, Texte, Medien und Verknüpfungen; Symbolaktionen nach dem Referenzmuster.
- Eigene Seiten mit DE/EN/FR, eigenen URLs, Menünamen, Reihenfolge, Sichtbarkeit und übergeordneten Menüpunkten derselben Sprache.
- URL-Historie für Bücher und eigene Seiten: Nach dem Speichern einer neuen Adresse bleiben frühere Adressen reserviert; veröffentlichte Inhalte werden per HTTP 301 zur aktuellen Adresse geleitet. Reservierte Systempfade und doppelte Adressen werden abgewiesen.

## Bestehende Inhalte

Migration 107 ergänzt nullable content_blocks-Spalten und die Tabellen pages und content_urls. Bestehende Daten werden nicht umgeschrieben. NULL bedeutet: bisherigen Inhalt unverändert anzeigen. Im Editor erscheint dafür „Bisheriger Inhalt“. Neue Elemente können davor oder dahinter angeordnet werden. Die explizite Liste [] zeigt keine Inhaltselemente. Entfernen des bisherigen Inhalts löscht seine Originalfelder nicht. Änderungen werden erst mit Speichern dauerhaft abgelegt.

Buchseiten, Orte und Veröffentlichungen verwenden den gemeinsamen Bausteinrenderer; Kapitelbausteine sind zusätzlich im zugehörigen Player sichtbar. Die eigenständigen Musik-, Hörbuch-, Film- und Kartenfunktionen bleiben bestehen. Neue Menüpunkte erscheinen erst, wenn eigene Seiten ausdrücklich veröffentlicht und im Menü aktiviert werden. Ohne eigene Seiten bleibt die bisherige Navigation bestehen.

Slideshow und Akkordeon unterstützen Sortierung und Einzelentfernung. Audio verwendet lokale MP3-, OGG-, WAV- oder M4A-Pfade; kein neuer Audio-Dateiupload. YouTube-Bausteine bauen erst nach Klick eine Verbindung auf. Ein Vorschaubild für diese Bausteine kommt bei Bedarf vom eigenen Webspace.

## Bewusste Anpassungen

Die sections-Datenbank und deren projektspezifische Layoutkonvertierung aus freiberger.design werden nicht auf Musikdaten übertragen. Bisherige Musikinhalte bleiben als bestehender Inhalt eingebunden; es gibt keine automatische Massenkonvertierung. Die Musikoberfläche verwendet ihre öffentlichen Styles. Die vorhandenen öffentlichen Stylesheets bleiben unverändert; zusätzliche Bausteinstyles greifen ausschließlich auf neue Elemente.

PHP 8.4 als neue Pflichtversion der Referenz wurde nicht übernommen. Die neuen Funktionen sind mit dem bestehenden PHP-8.3-Deployment kompatibel und lokal auch unter PHP 8.2 geprüft. composer.lock und package-lock.json fixieren die benötigten Bibliotheken. CI installiert Composer-Abhängigkeiten ohne Plugins und Skripte, das Deployment-Paket enthält deren Laufzeitdateien privat unter server/vendor. Der Deployment-Vorlauf prüft die für die HTML-Bereinigung benötigte PHP-DOM-Erweiterung vor dem Kopieren.

## Prüfung

npm test; npm run package:deploy; MUSIC_TEST_PACKAGE=dist-packages/freiberger-music-deploy.zip node --test tests/cms.test.mjs tests/private-preparation.test.mjs; php tests/deployment-package.test.php. Alle Datenbank-/HTTP-Tests arbeiten mit synthetischen Daten. Bedienung und die schreibfreie Vorschau werden zusätzlich im lokalen Browser geprüft.
