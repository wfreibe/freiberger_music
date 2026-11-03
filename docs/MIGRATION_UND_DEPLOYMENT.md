# freiberger.music: CMS und GitHub-Deployment

## Umgesetzte Grundlage

Die öffentliche Website behält Preact, TypeScript, sämtliche öffentlichen Komponenten,
Styles, URLs, Sprachumschaltung und den Player. Das CMS liegt unter `/cms`;
`/studio` führt dorthin. CMS und öffentliche Website laden ihre Styles getrennt.

Aus `C:/Dev/freiberger_design` übernommen: `Database`, `Auth`, `AdminCredentials`,
`PrivateStorage`, SQLite-Wartung, CLI-Zugangseinrichtung und der SSH/rsync-Deploymentablauf.
Die Sitzung heißt eigenständig `FREIBERGER_MUSIC_SESSION`. Das redaktionelle Layout
basiert auf dessen CMS-Styles; die Formulare und die API verwalten das Musik-Datenmodell.
Die allgemeinen Seiten-/Slideshow-Tabellen von freiberger.design werden nicht importiert.

Verwaltung: Releases (Songs, Singles, EPs, Alben, Hörbücher, GARD 7), Bücher,
Kapitel, Orte und Serien. Alle vorhandenen Datenbankfelder sind bearbeitbar.
Texte bleiben Klartext, wie im bestehenden Musik-Frontend. Bilder werden nach
MIME-/Größenprüfung mit GD als WebP neu kodiert und privat gespeichert.
Uploads bleiben bei abgebrochener Bearbeitung erhalten; ihre Zuordnung wird erst beim
Speichern übernommen. Löschungen verknüpfter Datensätze werden blockiert.
Eine Revision pro Datensatz verhindert das Überschreiben zwischenzeitlicher Änderungen.

## Lokale Nutzung

PHP >= 8.2 mit PDO SQLite und GD; Node.js mit den gesperrten Frontend-Abhängigkeiten.

1. `config/cms_config.sample.php` nach `config/cms_config.php` kopieren.
2. Nur für lokale HTTP-Entwicklung `cookie_secure` auf `false` setzen.
3. `php bin/import_music.php storage/freiberger.sqlite` erstellt eine geprüfte Kopie
   unter `data/content.sqlite`. Existierende Ziele werden abgelehnt.
4. `php bin/migrate.php`: ausschließlich additive CMS-Migrationen mit geprüfter Sicherung.
5. `php bin/provision_admin.php` nur in einem privaten lokalen Terminal ausführen.
   Das Einmalpasswort niemals in Chat, Logs oder CI ausgeben. Benutzername: `admin`.
6. `npm run dev`, dann `http://localhost:3000/cms`. Beim ersten Login eigenes Passwort setzen.

Alternativ: `node scripts/preview-cms.mjs` startet eine Vorschau mit temporären
synthetischen Daten ohne Administrator. Sie dient zur Prüfung von öffentlicher Darstellung
und Loginseite; produktive und lokale Inhaltsdaten werden nicht gelesen.

`npm test` prüft die vorhandenen Frontend-Funktionen sowie den CMS-HTTP-Ablauf mit
temporärer Testdatenbank. Netzwerkzugriff beschränkt sich auf den lokalen PHP-Testserver.
`npm run package:deploy` baut `dist-packages/freiberger-music-deploy.zip`.
`php tests/deployment-package.test.php` prüft dessen Inhalt.

## Zielstruktur bei DomainFactory

```text
<MUSIC_BASE>/
  webroot/                  Domainziel für freiberger.music
    index.php, index.html, .htaccess, assets/, covers/, api/
  server/
    lib/, bin/, migrations/, docs/
    config/cms_config.php   private Konfiguration
    data/content.sqlite    bestehende Musikinhalte und neuer CMS-Zugang
    data/uploads/          CMS-Bilder
    data/sessions/         Sitzungen
    backups/               geprüfte SQLite-Sicherungen
  .deploy/                 Pakete, Sperre, Release-Historie
```

Bestätigtes Musik-Basisverzeichnis: `/kunden/272116_83558/webseiten/freiberger_music`.
Der neue Domain-Webroot ist darin `webroot/`; das bisherige Domainziel liegt direkt
im Basisverzeichnis und muss bei der späteren Live-Umstellung bewusst geändert werden.

`MUSIC_BASE` muss ein eigenes Verzeichnis für Musik sein. Keine Pfade oder Zugangsdaten
von freiberger.design übernehmen. Das reguläre Deployment erwartet eine bereits
initialisierte Installation und verweigert einen fehlenden Datenbestand.

## Aktuell freigegeben: privater Aufbau ohne zusätzliche Sicherung

Freigabe vom 3. November 2026: neuen Stand privat vorbereiten, keine zusätzliche
Sicherung erstellen und die bestehende Website unverändert lassen. Das frühere
Sicherungsskript wird dafür nicht verwendet.

`bin/prepare_private.php` ist ein eigenständiges CLI-Skript. Es prüft die SHA-256-Summe
des Pakets und seine Einträge, verweigert ein vorhandenes Ziel sowie ein Ziel innerhalb
des Live-Verzeichnisses und entpackt ausschließlich in ein neues privates Verzeichnis.
Empfohlenes Vorbereitungsziel: `/kunden/272116_83558/freiberger-music-private`.
Dieses liegt außerhalb der bestehenden Domainziele. Das neue Verzeichnis erhält auf
dem Server Modus 0700 und zusätzlich eine HTTP-Sperre. Es ist damit zunächst auch
für den Webserver nicht als Vorschau freigegeben.

Die aktuelle Live-Datenbank wird ausschließlich lesend geöffnet und als Arbeitsdatenbank
für den neuen Stand importiert. Aktuell referenzierte lokale Medien werden übernommen.
Nur diese neue Arbeitskopie erhält die initialen CMS-Migrationen, ohne Sicherungslauf.
Es werden weder der bisherige Webroot noch Live-Konfiguration, Live-Datenbank oder
Hosting-Einstellungen überschrieben. Ein Administrator wird nicht automatisch angelegt.

Paket, CLI-Skript und die beim Build erzeugte `prepare-private.sh` werden außerhalb
des öffentlichen Webroots unter `/kunden/272116_83558/` hochgeladen. Die Shell-Datei
enthält die SHA-256-Summe genau dieses Pakets und startet die Vorbereitung mit PHP 8.3.
Bei Fehlern bleibt ein unvollständiges Ziel zur Untersuchung erhalten; es wird nicht
automatisch entfernt oder überschrieben. Nur ein Lauf mit `PREPARED.json` ist abgeschlossen.
Während der Vorbereitung keine Inhalte oder Medien im alten Studio bearbeiten.

Erzeugung: `npm run package:deploy`. Lokaler Funktionstest nach dem Build:
`node --test tests/private-preparation.test.mjs`. Dieser verwendet nur synthetische Daten
und prüft auch unveränderte Live-Quelldateien, fehlende Sicherungen, Prüfsummenfehler,
unsichere ZIP-Pfade und das Verbot, vorhandene Ziele zu überschreiben.

Die Arbeitskopie ist eine Momentaufnahme. Vor dem späteren Live-Wechsel müssen etwaige
neue Studio-Änderungen erneut abgeglichen werden. Die Einrichtung allein aktiviert keine
Domain, keine PHP-Umstellung und kein Deployment.

## Spätere Live-Umstellung – separat freizugeben

Vorher Zielpfad und Domainzuordnung prüfen und den Rückfallweg zur bisherigen Installation
festlegen. Eine zusätzliche Sicherung ist derzeit nicht beauftragt. Schreibzugriffe im alten
Studio während des abschließenden Inhaltsabgleichs und der Umstellung stoppen. Der
bisherige Webroot bleibt als Rückfallmöglichkeit erhalten.

Das geprüfte Paket dort entpacken. Private Konfiguration aus dem Beispiel erstellen,
`cookie_secure=true` beibehalten. Die **aktuelle Live-Datenbank** mit
`server/bin/import_music.php` in die neue Datenablage kopieren; keine lokale Datenbank
übertragen. Medien aus der bisherigen Installation übernehmen und Vollständigkeit prüfen.
Migration und private CLI-Zugangseinrichtung ausführen. Erst dann die Domain auf den neuen
Webroot umstellen. API, Buch-/QR-URLs, Cover, Sprachen, YouTube-Player und CMS prüfen.
Bei Fehlern Domainziel auf den gesicherten alten Webroot zurückstellen. Vor späterem
erneutem Wechsel müssen zwischenzeitliche CMS-Änderungen abgeglichen werden.

## GitHub

Zielrepository: https://github.com/wfreibe/freiberger_music (am 3. November 2026
im Browser als vorhandenes, leeres Repository geprüft).
`development`: Tests und prüfbares Build-Artefakt. `master`: nach erfolgreichen Tests
Deployment in GitHub-Environment `production`.

Environment-Secrets: `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS` (Hostkey separat verifizieren).
Environment-Variablen: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_PHP`.
Pfadformat wie im Design-Projekt: `/kunden/NUMMER_NUMMER/webseiten/ORDNER`.
`DEPLOY_PHP` auf die geprüfte PHP-CLI setzen (bei Design `/usr/bin/php83`).
Ziel-URL ist fest auf `https://freiberger.music` begrenzt.

Am 3. November 2026 eingerichtet und zurückgelesen: Environment `production`,
Beschränkung auf Branch `master`, erforderliche manuelle Freigabe durch `wfreibe`,
`DEPLOY_PATH=/kunden/272116_83558/webseiten/freiberger_music` und
`DEPLOY_PHP=/usr/bin/php83`. SSH-Host, SSH-Benutzer und Deployment-Secrets fehlen
noch. Es wurde kein `master`-Branch und kein Produktionsdeployment angelegt.

Das Workflow-File alleine richtet weder Repository-Secrets noch Hosting ein.
Die einmalige Produktionsumstellung und die Einrichtung der Environment-Werte
erfolgen getrennt von der Veröffentlichung auf `development`.

## Reguläres Deployment und Rückfall

Das Paket enthält ausschließlich Code und statische Medien, keine Datenbanken, Sitzungen,
Konfiguration oder Uploads. Vor dem Einspielen werden SQLite- und Anwendungssicherungen
erstellt. `rsync` verwendet kein `--delete`; Laufzeitverzeichnisse sind ausgeschlossen.
Migrationen laufen explizit per CLI, niemals bei öffentlichen API-Aufrufen.

Bei einem Deployfehler: weitere Deployments stoppen und unter `.deploy/history/RELEASE/`
die gesicherten Dateien prüfen. Die automatische Pipeline führt **keinen automatischen
Rollback** aus. Wiederherstellung muss bewusst unter Wartung erfolgen: alte Anwendungsdateien
aus `application.tar` übernehmen; bei Bedarf die geprüfte Datenbanksicherung mit
`server/bin/restore.php BACKUP --maintenance` wiederherstellen, während alle Writer gestoppt
sind. Das verwirft nach der Sicherung entstandene Änderungen und benötigt eine eigene Freigabe.
