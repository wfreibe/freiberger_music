-- Schema & Seed Data for freiberger.music
-- Includes audiobook playlists PLYjciFHvZoyU (DE) and PLbf_CjWtjwr0 (FR)

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS places;
CREATE TABLE places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    greek_name TEXT,
    tagline TEXT,
    description TEXT,
    coordinates TEXT,
    image TEXT,
    accent_color TEXT DEFAULT '#387780',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('1', 'naxos', 'NAXOS', 'Νάξος', 'Das Tor zur Erinnerung', 'Weißer Marmor, unbändiger Wind und die monumentale Portara, die stumm über die Wellen nach Delos blickt. Hier kreuzen sich die Wege antiker Götter mit dem Rauschen der Ägäis.', '37.106° N, 25.376° E', '/covers/places/naxos.svg', '#387780', '1', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('2', 'santorini', 'SANTORINI', 'Σαντορίνη', 'Die Asche der Zeit', 'Schwarzer Bimsstein, rote Klippen und die unendliche Tiefe der Caldera. Eine Landschaft wie aus erstarrtem Klang, wo jede Schicht der Erde eine Epoche erzählt.', '36.393° N, 25.461° E', '/covers/places/santorini.svg', '#c75d4d', '2', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('3', 'athens', 'ATHENS', 'Αθήνα', 'Die schlaflose Wiege', 'Zwischen jahrtausendealten Säulen und pulsierendem Nachtleben unter freiem Himmel. Das Summen der Metropole verbindet sich mit dem kühlen Nachtwind der Akropolis.', '37.983° N, 23.727° E', '/covers/places/athens.svg', '#d4b483', '3', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('4', 'zakynthos', 'ZAKYNTHOS', 'Ζάκυνθος', 'Das Licht des Westens', 'Schroffe weiße Kalksteinfelsen stürzen in ein fast unwirkliches, tiefes Ionisches Türkis. Ein Ort, an dem Meer und Himmel ineinanderfließen.', '37.787° N, 20.897° E', '/covers/places/zakynthos.svg', '#4a88b5', '4', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('5', 'crete', 'CRETE', 'Κρήτη', 'Die Wiege des Labyrinths', 'Schroffe Schluchten, uralte Olivenhaine und archaische Melodien. Die Insel der verborgenen Täler und der ungebändigten Freiheit.', '35.240° N, 24.809° E', '/covers/places/crete.svg', '#c27d38', '5', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('6', 'rhodes', 'RHODES', 'Ρόδος', 'Mauern und Schiffe', 'Mittelalterliche Wehrmauern, alter Hafenstaub und der Duft von warmem Stein und Pinienharz, getragen vom levantinischen Wind.', '36.434° N, 28.217° E', '/covers/places/rhodes.svg', '#e0a96d', '6', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('7', 'kos', 'KOS', 'Κως', 'Insel des Windes', 'Verwehte Fragmente zwischen dem uralten Asklepieion und dem weiten Blick über die Meerenge hinüber zum anatolischen Festland.', '36.893° N, 27.287° E', '/covers/places/kos.svg', '#569eab', '7', '2026-09-07 14:09:20');
INSERT INTO places (id, slug, name, greek_name, tagline, description, coordinates, image, accent_color, sort_order, created_at) VALUES ('8', 'corfu', 'CORFU', 'Κέρκυρα', 'Der grüne Norden', 'Venezianische Eleganz, verwinkelte Gassen und das tiefe Rauschen der dichten Zypressen- und Olivenwälder am Ionischen Meer.', '39.624° N, 19.921° E', '/covers/places/corfu.svg', '#457b9d', '8', '2026-09-07 14:09:20');

DROP TABLE IF EXISTS series;
CREATE TABLE series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

INSERT INTO series (id, slug, title, description, sort_order) VALUES ('1', 'the-greece-chapters', 'THE GREECE CHAPTERS', 'Der offizielle Soundtrack zum Buch Die Orte, die uns sahen.', '1');
INSERT INTO series (id, slug, title, description, sort_order) VALUES ('2', 'hoerbuch-die-orte-die-uns-sahen', 'DAS HÖRBUCH', 'Das deutschsprachige Hörbuch zu Die Orte, die uns sahen.', '2');
INSERT INTO series (id, slug, title, description, sort_order) VALUES ('3', 'gard-7', 'GARD 7', 'Song-Videos & Produktionen von GARD 7', '3');
INSERT INTO series (id, slug, title, description, sort_order) VALUES ('4', 'livre-audio-les-lieux-qui-nous-ont-vus', 'LES LIEUX QUI NOUS ONT VUS · LIVRE AUDIO', 'Le livre audio en français, en douze chapitres.', '4');

DROP TABLE IF EXISTS books;
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT DEFAULT 'Werner Freiberger',
    description TEXT,
    cover TEXT,
    release_year INTEGER DEFAULT 2026,
    formats TEXT DEFAULT 'BUCH · E-BOOK · HÖRBUCH · MUSIK'
);

INSERT INTO books (id, slug, title, subtitle, author, description, cover, release_year, formats) VALUES ('1', 'die-orte-die-uns-sahen', 'Die Orte, die uns sahen', 'Als die Zukunft noch keinen Namen hatte', 'Werner Freiberger', 'Eine biografisch-poetische Reise durch Griechenland. Elf Kapitel und ein Epilog erzählen von Jugend, Freiheit, Aufbrüchen, Freundschaft und den Schauplätzen, die als Musik und Erinnerung weiterleben.', '/covers/books/die-orte-die-mich-sahen.svg', '2026', 'BUCH · E-BOOK · HÖRBUCH · MUSIK');

DROP TABLE IF EXISTS chapters;
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
    release_id INTEGER, -- Soft link to releases
    excerpt TEXT,
    sort_order INTEGER DEFAULT 0
);

INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('36', '1', '1', 'Kapitel 1: Die Stadt über der Stadt', 'Eine Erinnerung an Athen', '3', '45', 'Die Stadt über der Stadt – Eine Erinnerung an Athen
Es gibt Reisen, die erst Jahre später ihre wahre Bedeutung entfalten. Dieses Kapitel ist der literarische Nachhall einer solchen Reise nach Athen.', '1');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('37', '1', '2', 'Kapitel 2: Jung genug, dem Horizont zu glauben', 'Eine Erinnerung an Zakynthos', '4', '43', 'Jung genug, dem Horizont zu glauben – Eine Erinnerung an Zakynthos
Das Meer sah vom Ufer aus harmlos aus. Dieses Kapitel ist die literarische Rückkehr zu einem Sommertag auf Zakynthos, an dem drei 17-Jährige beschlossen, einfach zur Insel Marathonisi hinauszuschwimmen.', '2');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('38', '1', '3', 'Kapitel 3: Grün, das keinen Horizont brauchte', 'Eine Erinnerung an Korfu', '8', '44', 'Grün, das keinen Horizont brauchte – Eine Erinnerung an Korfu
Manchmal führt der Weg nach Griechenland nicht zuerst ins Blau, sondern ins Grün. Dieses Kapitel ist der literarische Nachhall einer langen Reise: Von der endlosen Straße durch Italien über das schwarze Wasser der Nachtfähre bis in den feuchten, stillen Nebel von Korfu.', '3');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('39', '1', '4', 'Kapitel 4: Die Ader hinaus in die Welt', 'Von Athen nach Naxos', '3', '42', 'Die Ader hinaus in die Welt – Von Athen nach Naxos
Manche Orte sind keine Ziele, sondern Türen. Dieses Kapitel ist der literarische Übergang zwischen zwei Welten: der Ankunft im lauten, vertrauten Athen und dem Aufbruch am Hafen von Piräus.', '4');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('40', '1', '5', 'Kapitel 5: Stimmen unter freiem Himmel', 'Eine Erinnerung an Naxos', '1', '48', 'Stimmen unter freiem Himmel – Eine Erinnerung an Naxos
Manche Sommer wissen noch nicht, dass sie einmal zur Erinnerung werden. Dieses Kapitel des Hörbuchs ist eine Rückkehr auf die Insel Naxos: Fahrtwind auf Motorrädern, der Staub der Straßen, weiße Gassen in Chora und Nächte im Schlafsack unter dem Sternenhimmel.', '5');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('41', '1', '6', 'Kapitel 6: Der Sprung und der Fall', 'Eine Erinnerung an Santorini', '2', '47', 'Der Sprung und der Fall – Eine Erinnerung an Santorini
Damals glaubten wir noch, Freiheit bedeute vor allem, dass uns nichts halten konnte. Dieses Kapitel des Hörbuchs nimmt uns mit auf die Klippen von Santorini. Vor der Kulisse leuchtend weißer Häuser auf schwarzem Vulkangestein geht es um jene Form der Unverwundbarkeit, die vielleicht nur der Jugend gehört.', '6');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('42', '1', '7', 'Kapitel 7: Drei Motoren unter einem jungen Himmel', 'Eine Erinnerung an Kreta', '5', '46', 'Drei Motoren unter einem jungen Himmel – Eine Erinnerung an Kreta
Manche Reisen beginnen nicht mit einem Plan, sondern mit dem einfachen Entschluss, loszufahren. Dieses Kapitel des Hörbuchs nimmt uns mit auf drei Motorrädern quer über die Insel Kreta. Vom warmen Gegenwind auf den Straßen über das leuchtende Blau von Elafonissi bis in die gewaltige Stille der Samaria-Schlucht.', '7');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('43', '1', '8', 'Kapitel 8: Die Hand, die bleibt', 'Eine Erinnerung an Santorini', '2', '47', 'Die Hand, die bleibt – Eine Erinnerung an Santorini
Irgendwann wird das Leben größer als die Reise. Dieses Kapitel des Hörbuchs erzählt von der Rückkehr nach Santorini – elf Jahre nach dem ersten unbeschwerten Sommer. Die wilden Klippensprünge der Jugend weichen einer leiseren, aber nicht minder intensiven Reise an der Seite der eigenen Frau.', '8');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('44', '1', '9', 'Kapitel 9: Das Tor, das uns wiedersah', 'Eine Erinnerung an Naxos', '1', '48', 'Das Tor, das uns wiedersah – Eine Erinnerung an Naxos
Manche Orte besuchen wir nicht, um uns an sie zu erinnern, sondern um uns an uns selbst zu erinnern. Dieses Kapitel des Hörbuchs erzählt von der Rückkehr nach Naxos – zurück in die weißen Gassen von Chora, zurück zur gewaltigen Portara.', '9');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('45', '1', '10', 'Kapitel 10: Vor dem ersten Schlag', 'Eine Erinnerung an Kos', '7', '50', 'Vor dem ersten Schlag – Eine Erinnerung an Kos
Manche Orte bewahren, wer wir einmal waren. Andere werden Teil eines Menschen, bevor dieser überhaupt eine eigene Erinnerung besitzen kann. Dieses Kapitel des Hörbuchs erzählt von einer Reise nach Kos – der Insel, auf der aus zwei Menschen leise drei wurden.', '10');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('46', '1', '11', 'Kapitel 11: Zwei Flaschen auf einem Tisch', 'Eine Erinnerung an Rhodos', '6', '49', 'Zwei Flaschen auf einem Tisch – Eine Erinnerung an Rhodos
Einen Menschen zu lieben bedeutet nicht, sein Leben für ihn leben zu können. Dieses Kapitel des Hörbuchs erzählt von einer Reise nach Rhodos – Vater und Sohn an einem Tisch in den belebten Gassen der Altstadt.', '11');
INSERT INTO chapters (id, book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order) VALUES ('47', '1', '12', 'Epilog: Was das Meer bewahrte', 'Ein Rückblick auf Griechenland', '1', '51', 'Was das Meer bewahrte – Ein Rückblick auf Griechenland
„Warum müsste etwas ewig sein, um wirklich gewesen zu sein?“ Dieses abschließende Kapitel des Hörbuchs bündelt alle Fäden der Reise: von den unbeschwerten Motorradfahrten der Jugend auf Naxos und Kreta über die Rückkehr als Vater nach Kos und Rhodos bis hin zu den unauslöschlichen Momenten von Liebe und Verlust.', '12');

DROP TABLE IF EXISTS releases;
CREATE TABLE releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    type TEXT DEFAULT 'single', -- single, ep, album, chapter_audio
    release_date TEXT,
    cover TEXT,
    youtube_id TEXT,
    youtube_playlist_id TEXT,
    genre TEXT DEFAULT 'Future Garage',
    bpm INTEGER,
    duration TEXT,
    description TEXT,
    story TEXT,
    lyrics TEXT,
    place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
    chapter_id INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
    series_id INTEGER REFERENCES series(id) ON DELETE SET NULL,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
, spotify_url TEXT, apple_music_url TEXT, audio_url TEXT);

INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('42', 'bevor-das-licht-einen-namen-hatte', 'Bevor das Licht einen Namen hatte', 'Von Delos nach Delphi', 'song', '2026-03-01', '/covers/songs/bevor-das-licht-einen-namen-hatte.jpg', 'dvLEsXrZXJ8', 'PLIcnGWUVhwf4', 'Mythic Aegean Future Garage', '134', '07:27', '"Bevor das Licht einen Namen hatte" erzählt die Geschichte Apollons, bevor er zum Gott des Lichtes wurde.', 'Leto trägt ihre Kinder durch eine Welt, die ihnen keinen Ort gewähren will. Erst Delos, eine Insel ohne Wurzeln, nimmt sie auf. Dort wird Apollon geboren – nicht als strahlender Gott, sondern als junger, suchender Sohn, der sich fragt, warum die Nacht noch in ihm lebt, obwohl er selbst einmal das Licht verkörpern soll.

Sein Weg führt nach Delphi, wo er im Dunklen nicht nur einen Gegner erkennt, sondern vielleicht auch einen Teil seiner selbst. Jahrtausende später beobachtet Apollon Menschen, die durch Meteora, Delphi, Zakynthos und Athen reisen. Auch sie tragen Verlust, Erinnerung und einen unsichtbaren Winter mit sich.

Der Song verbindet griechische Mythologie mit einer persönlichen Reise durch Trauer, Erinnerung und Neubeginn. Dabei entsteht die Erkenntnis, dass Licht nicht dort beginnt, wo Dunkelheit endet. Es beginnt dort, wo etwas in ihr wieder zu atmen wagt.

Musikalisch verbindet der Song atmosphärischen Future Garage, gebrochenen 2-Step, tiefe Reese-Bässe, rituelle Stimmen und griechisch gefärbte Saitenklänge zu einer dunklen, cinematischen und zugleich hoffnungsvollen Klangwelt.

Genre: Mythic Aegean Future Garage / Ritual 2-Step / Dark Melodic Electronica
Tempo: ca. 134 BPM
Länge: 7:26 Minuten
Sprache: Deutsch mit griechischen Chant- und Refrainpassagen

#BevorDasLichtEinenNamenHatte #FutureGarage #Apollon #Apollo #Leto #Delos #Delphi #GreekMythology #AegeanFutureGarage #Ritual2Step #DarkElectronica #MythicElectronica #GreekMusic #CinematicMusic #FREIBERGER', NULL, '3', NULL, '1', '1', '1', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('43', 'das-meer-das-uns-bewahrte', 'Das Meer, das uns bewahrte', 'Eine Erinnerung an Zakynthos & Marathonisi', 'song', '2026-03-01', '/covers/songs/das-meer-das-uns-bewahrte.jpg', 'd87nefPuDgU', 'PLIcnGWUVhwf4', 'Ionian Ritual Trip-Hop / Future Garage', '124', '07:05', 'DAS MEER, DAS UNS BEWAHRTE
German Mediterranean Future Garage / Dark Organic 2-Step / Ionian Ritual Trip-Hop', '„Das Meer, das uns bewahrte“ erzählt von Zakynthos, Marathonisi und einem Sommer, der im Wasser weiterlebt.

Gesungen aus der Perspektive von Artemis wird das Ionische Meer zu einer zeitlosen Hüterin von Jugend, Mut und Erinnerung. Sie beobachtet jene, die einst ins offene Blau sprangen, ohne zu wissen, dass dieser Augenblick eines Tages zu einem Teil ihres späteren Lebens werden würde.

Der Song verbindet poetische deutsche Vocals mit griechischen Chants, akustischer Mandoline, tiefem Reese-Subbass, gebrochenen 2-Step-Drums, rituellen Toms, Congas und dunklen mediterranen Klangflächen.

Im Zentrum steht ein poetischer Droste-Effekt:

Der ältere Mensch erinnert sich an den Jungen im Wasser.
Doch im Spiegel des Meeres blickt dieser Junge bereits auf sein späteres Ich zurück.
Hinter beiden erscheint ein weiterer Blick aus einer noch ferneren Zeit.

So wird das Wasser zu einem Spiegel innerhalb eines Spiegels – und die Erinnerung zu einer Welle, die immer wieder denselben Sommer in sich trägt.

„Das Meer, das uns bewahrte“ handelt von den Orten, die wir verlassen, die uns selbst aber niemals ganz verlassen.

Ihr habt das Meer verlassen.
Doch das Meer verließ euch nie.

Music by FREIBERGER

#DasMeerDasUnsBewahrte #FREIBERGER #Zakynthos #Marathonisi #Artemis #FutureGarage #CinematicFutureGarage #Dark2Step #TripHop #MediterraneanMusic #GreekMusic #IonianSea #GreekMythology #AtmosphericMusic #ElectronicMusic #DrosteEffect #MemoryLoop #GermanMusic', NULL, '4', NULL, '1', '0', '2', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('44', 'wo-das-gruen-uns-wiederfand', 'Wo das Grün uns wiederfand', 'Eine Erinnerung an Korfu & Korkyra', 'song', '2026-03-01', '/covers/songs/wo-das-gruen-uns-wiederfand.jpg', '5WFzRxamMPs', 'PLIcnGWUVhwf4', 'Ionian Future Garage / Ambient 2-Step', '118', '06:11', '"Wo das Grün uns wiederfand" erzählt von einer Insel, die nichts verlangt – und gerade deshalb bleibt.', 'Vier Menschen kommen über Nacht über das Meer. Hinter ihnen liegen Straßen, Stimmen und ein Alltag, der noch nach ihnen greift. Vor ihnen liegt Korkyra: grün, still, feucht vom Morgen und halb verborgen im Nebel.

Aus der Perspektive der jungen Nymphe Korkyra, deren Name mit der Insel Korfu verbunden ist, wird die Reise zu etwas Zeitlosem. Sie beobachtet, wie aus Eile langsam Atem wird. Wie ein Haus auf einer Anhöhe, Schafe im milchigen Licht, eine entfernte Glocke und ein Tal voller Grün für einige Tage eine andere Form von Zeit entstehen lassen.

Korkyra gibt keine Antworten.

Sie lässt nur Raum.

„Während ihr schlieft,
trug euch das Meer
aus euren Namen hinaus.“

Die Reisenden suchen nichts – und vielleicht können sie gerade deshalb etwas finden.

Später führen die Wege höher. Das Grün weicht zurück, Dächer werden klein und das Meer erscheint wieder am Horizont. Für einen Augenblick wird die Welt weit genug, um alles, was drängt, kleiner erscheinen zu lassen.

Im Zentrum des Songs steht ein rekursiver Droste-Effekt:

In einem Tal liegt ein Haus.
Im Haus liegt ein Morgen.
Im Morgen liegt Nebel.
Im Nebel geht eine Herde …

Bis schließlich aus Stille wieder eine Straße wird – und aus der Straße das Meer.

Denn irgendwo dort wartet bereits die nächste Insel.

Korkyra hält die Reisenden nicht fest:

„Das Gras hält den Wind
auch nicht fest.“

Sie lässt sie weiterziehen.

Und Jahre später genügt vielleicht eine Wiese, etwas Nebel oder der Klang einer Glocke – und für einen Moment öffnet sich dieses Fenster wieder.

„Wo das Grün uns wiederfand“ verbindet poetisches deutsches Storytelling mit griechischen Ritual-Vocals, rollendem Reese-Bass, gebrochenem 2-Step, ionischen Klangfarben und einem organischen Future-Garage-Groove.

Ein Song über Freundschaft, Natur, Entschleunigung und jene Orte, die nur kurz Teil unseres Weges sind – und trotzdem nicht verschwinden.

Manche Orte bauen kein Haus in uns.
Sie öffnen nur für ein paar Tage ein Fenster.

FREIBERGER

#WoDasGrünUnsWiederfand #FREIBERGER #Korkyra #Kerkyra #Korfu #Corfu #GreekMythology #FutureGarage #IonianFutureGarage #MistValley2Step #GreekMusic #MediterraneanElectronica #ElectronicMusic #AmbientMusic #Griechenland #Greece #TravelMemories #Mythology #AtmosphericMusic #ReeseBass', NULL, '8', NULL, '1', '0', '3', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('45', 'die-stadt-die-mich-sah', 'Die Stadt, die mich sah', 'Eine Erinnerung an Athen', 'song', '2026-03-01', '/covers/songs/die-stadt-die-mich-sah.jpg', '3-_lDTXqijw', 'PLIcnGWUVhwf4', 'Dark Atmospheric 2-Step / Future Garage', '124', '07:51', 'DIE STADT, DIE MICH SAH
German Cinematic Future Garage / Dark Atmospheric 2-Step / Mediterranean Trip-Hop', '„Die Stadt, die mich sah“ erzählt von Athen als einem lebendigen Wesen – einer Stadt aus Marmor, Stimmen, Wein, Licht und Erinnerung.

Der Song führt durch Plaka, über den Areopag, hinein in die dionysische Nacht von Dafni, hinab zur Agora und schließlich hinaus nach Piräus, wo sich die Stadt zum Meer öffnet. Jeder dieser Orte steht für eine andere Erfahrung: Jugend, Freiheit, Rausch, Erkenntnis, Aufbruch und Rückkehr.

Im Zentrum steht die Frage, wer hier eigentlich wen erinnert:

Erinnert sich der Mensch an Athen – oder bewahrt Athen die Erinnerung an den Menschen, der dort einmal jung war?

Der Song arbeitet mit einem musikalischen und poetischen Droste-Effekt: Ein älteres Ich blickt auf den jungen Menschen zurück, während hinter ihm bereits eine weitere zukünftige Erinnerung entsteht. Vergangenheit, Gegenwart und Zukunft liegen wie Bilder ineinander.

Zwischen tiefem Reese-Subbass, gebrochenen 2-Step-Drums, atmosphärischem Trip-Hop, verfremdeten Bouzouki-Klängen, griechischen Chants und ritueller Percussion entsteht ein dunkler, cineastischer Erinnerungsraum.

Athen ist hier nicht nur ein Ort.

Athen ist die Stadt, die dich ansieht, während du glaubst, sie zu betrachten.

Music by FREIBERGER

#DieStadtDieMichSah #FREIBERGER #Athen #Athens #FutureGarage #CinematicFutureGarage #Dark2Step #TripHop #MediterraneanMusic #GreekMusic #GreekMythology #Areopag #Agora #Piraeus #Dafni #ElectronicMusic #AtmosphericMusic #DrosteEffect #MemoryLoop', NULL, '3', NULL, '1', '0', '4', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('46', 'der-himmel-kannte-unsere-namen', 'Der Himmel kannte unsere Namen', 'Eine Reise durch Kreta', 'song', '2026-03-01', '/covers/songs/der-himmel-kannte-unsere-namen.jpg', 'ZSzFRGumV9Q', 'PLIcnGWUVhwf4', 'Cretan Ritual Future Garage', '127', '06:56', 'DER HIMMEL KANNTE UNSERE NAMEN
German Cretan Ritual Future Garage / Mystical Atmospheric 2-Step / Cinematic Mediterranean Electronica', '„Der Himmel kannte unsere Namen“ erzählt von drei jungen Männern auf Motorrädern, von einer Reise durch Kreta und von einem gemeinsamen Anfang, der auch Jahrzehnte später weiterfährt.

Die Geschichte wird aus der Perspektive von Rhea, der Mutter des Zeus, erzählt. Einst verbarg sie ihren Sohn unter kretischem Stein – noch bevor er Donner war, noch bevor der Himmel seinen Namen kannte. Jahre später hört sie drei junge Reisende über ihre Insel ziehen.

Vier Jungen stehen damit unter demselben Himmel:

drei auf den Straßen Kretas,
einer verborgen im Atem der Berge.

Keiner von ihnen weiß, welcher Mensch – oder welcher Gott – bereits in ihm wartet.

Die Reise führt durch Heraklion, Knossos, Elafonissi, Samaria und Lasithi. Doch Kreta bleibt nicht nur eine Landschaft. Die Insel wird zum Ursprung einer Erinnerung, die sich in jeder späteren Straße fortsetzt.

Im Zentrum des Songs steht ein Freund, der heute auf keiner Straße mehr fährt.

Doch wenn zwei Motoren durch die Erinnerung ziehen, entsteht zwischen ihnen noch immer der Klang eines dritten.

Zwei Motoren erinnern sich an drei.

Der Song arbeitet mit einem poetischen Droste-Effekt:

Im Mann lebt noch der Junge.
Im Jungen liegt die Straße.
In der Straße liegt der erste Morgen.
Und im ersten Morgen bereits der spätere Blick, der sich eines Tages an ihn erinnern wird.

Auch Rhea erkennt ihren Sohn in diesem Kreislauf wieder:

Der Stein blieb in seinem Donner.
Die Dunkelheit blieb in seinem Himmel.
Das Kind blieb in seinem Namen.

Musikalisch verbindet „Der Himmel kannte unsere Namen“ eine rauchige weibliche Contralto-Stimme mit gebrochenen 2-Step-Drums, tiefem Reese-Subbass, kretischer Lyra, Laouto-Fragmenten, ritueller Percussion, Höhlenresonanzen, Meereswind und entfernten Motorradgeräuschen.

Die griechischen Chants

„Pán-da e-no-mé-ni“
und
„Ef-cha-ris-tó Krí-ti“

werden zu einem Ritual der Erinnerung – nicht immer auf derselben Straße, aber immer im selben Anfang.

Am Ende bleibt die Erkenntnis:

Heimat war kein Ziel.
Sie war der Abstand
zwischen drei Motoren
im südlichen Licht.

To taxídi ménei.
Die Reise bleibt.

Music by FREIBERGER

#DerHimmelKannteUnsereNamen #FREIBERGER #Kreta #Rhea #Zeus #FutureGarage #CretanMusic #RitualFutureGarage #MysticalMusic #Atmospheric2Step #CinematicElectronica #GreekMythology #MotorcycleJourney #Memory #Friendship #DrosteEffect #PandaEnomeni #EfcharistoKriti #GermanMusic', NULL, '5', NULL, '1', '0', '5', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('47', 'wo-die-asche-atmet', 'Wo die Asche atmet', 'Eine Erinnerung an Santorini & Akrotiri', 'song', '2026-03-01', '/covers/songs/wo-die-asche-atmet.jpg', 'YTb6bBPs7sc', 'PLIcnGWUVhwf4', 'Dark Aegean Deep House', '125', '06:53', 'Wo die Asche atmet ist ein dunkler, hypnotischer Deep-House-Track über Fall, Feuer und die Fähigkeit, aus Verletzung etwas Tragendes entstehen zu lassen.', 'Im Zentrum steht Hephaistos – nicht als mächtiger Schmiedegott, sondern als eine verletzliche Stimme, die sich an den eigenen Fall erinnert.

Über ihm Licht.
Unter ihm das Meer.
Dazwischen nur Atem, Salz und ein Körper, der lernen musste, sich selbst zu tragen.

Santorini wird dabei zum Spiegel seiner Geschichte: schwarzer Stein, tiefe Glut, helle Häuser, offenes Meer. Unter der Schönheit bleibt immer etwas in Bewegung.

Unter der Asche bleibt Feuer.
Unter dem Schweigen bleibt eine Form.

Akrotiri steht im Song für genau diesen Gedanken: Was einmal durch Hitze, Druck und Zerstörung gegangen ist, verschwindet nicht einfach. Es verändert sich.

Hephaistos lernt Metall, weil Hitze Formen verändert.
Er lernt Feuer, weil es nichts beschönigt.

Und irgendwann versteht er:

Das Feuer sah Material.

Aus dem Bruch entsteht etwas Neues.
Nicht, weil die Vergangenheit ungeschehen wird – sondern weil aus ihr etwas entstehen kann, das bleibt.

Später verändert sich auch die Bedeutung des Feuers.

Aus der Glut, die einst an den Rand trieb, wird Wärme.
Aus dem Fallen wird Halten.
Aus dem Jungen wird jemand, der selbst eine Hand reichen kann.

Ich wurde nicht heil.
Ich lernte nur,
aus dem Bruch etwas zu bauen,
das bleiben konnte.

Musikalisch verbindet „Wo die Asche atmet“ einen treibenden Dark Aegean Deep House Groove mit einer warmen, eng geführten Bassline, atmosphärischen Synth-Flächen und einer rauen, höheren männlichen Tenorstimme.

Griechische Elemente erscheinen bewusst nur im Intro und in den Refrains – wie kurze Stimmen aus der Landschaft selbst.

Ein Song über Santorini.
Über Hephaistos.
Über Druck, Glut und Veränderung.

Und über die Erkenntnis:

Das Feuer verschwand nie.
Es lernte nur, anders zu brennen.

FREIBERGER

#WoDieAscheAtmet #FREIBERGER #Santorini #Akrotiri #Hephaestus #GreekMythology #DeepHouse #AegeanDeepHouse #AtmosphericHouse #ProgressiveHouse #MediterraneanElectronica #GreekMusic #ElectronicMusic #DarkDeepHouse #Mythology #CinematicMusic', NULL, '2', NULL, '1', '0', '6', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('48', 'als-der-horizont-uns-wiedersah', 'Als der Horizont uns wiedersah', 'Eine Rückkehr nach Naxos', 'song', '2026-03-01', '/covers/songs/als-der-horizont-uns-wiedersah.jpg', 'elMGltCaFfM', 'PLIcnGWUVhwf4', 'Mythic Cycladic Future Garage', '130', '6:19', '"Als der Horizont uns wiedersah" erzählt von Naxos, Dionysos und der Frage, ob ein Mensch im Laufe seines Lebens mehr als einmal geboren werden kann.', 'Dionysos beginnt nicht als Gott des Weines oder der Ekstase, sondern als junger, zweimal Geborener. Seine erste Geburt endet im Feuer seiner Mutter Semele, seine zweite beginnt im Körper des Zeus. Schon früh erfährt er, dass Identität nichts Festes ist – dass unter derselben Haut ein anderer Mensch entstehen kann.

Auf Naxos begegnet er der Portara, dem Tor eines anderen Gottes. Ihre geraden Linien und ihr weißer Stein werden zum Gegenbild seiner eigenen Natur: Ordnung trifft auf Bewegung, Apollon auf Dionysos, Grenze auf Überschreitung.

Jahrtausende später sieht Dionysos Menschen auf die Insel zurückkehren. Einst waren es vier, nun sind es zwei. Doch Naxos erinnert sich noch an ihre Stimmen, an Kastro, Apiranthos, Filoti, den Berg Zas und an die Wege unter offenem Himmel.

Die zweite Reise wird zum Spiegel seiner eigenen Geschichte:

Ein Körper trägt ein Kind.
Das Kind trägt eine Erinnerung.
Die Erinnerung trägt eine Insel.
Vier Stimmen werden zwei.
Zwei Stimmen tragen vier.

Der Song versteht Ekstase dabei nicht als Vergessen oder Rausch, sondern als einen Moment, in dem die Grenzen des eigenen Ichs aufbrechen – weit genug, um den Menschen zu sehen, der man einmal war, und den, der inzwischen unter derselben Haut lebt.

„Als der Horizont uns wiedersah“ ist ein Song über Rückkehr, Verlust, Erinnerung und Transformation. Über Orte, die gleich bleiben, während die Menschen, die zu ihnen zurückkehren, längst andere geworden sind.

Vielleicht ist jede Rückkehr eine zweite Geburt.

Genre: Mythic Cycladic Future Garage / Dionysian Ritual 2-Step / Dark Mediterranean Electronica
Tempo: ca. 129 BPM
Länge: 6:48 Minuten
Sprache: Deutsch mit griechischen Chant- und Refrainpassagen

#AlsDerHorizontUnsWiedersah #Dionysos #Dionysus #Naxos #Portara #Semele #Ariadne #FutureGarage #Ritual2Step #GreekMythology #CycladicFutureGarage #MythicElectronica #DarkElectronica #GreekMusic #FREIBERGER', NULL, '1', NULL, '1', '0', '7', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('49', 'bis-unter-dem-wasser-wieder-land-erscheint', 'Bis unter dem Wasser wieder Land erscheint', 'Eine Reise nach Rhodos & Helios', 'song', '2026-03-01', '/covers/songs/bis-unter-dem-wasser-wieder-land-erscheint.jpg', 'pVy3cQxnpm0', 'PLIcnGWUVhwf4', 'Cinematic Rhodian Future Garage', '129', '06:12', '"Bis unter dem Wasser wieder Land erscheint" erzählt von einer Reise nach Rhodos – und von der Hoffnung, dass etwas, das verloren scheint, vielleicht nur unter der Oberfläche verborgen liegt.', 'Im griechischen Mythos erkennt Helios die Insel Rhodos bereits, als sie noch unter dem Meer verborgen ist. Die anderen Götter sehen nur Wasser. Helios sieht Land, bevor es sichtbar wird.

Aus dieser Perspektive beobachtet er einen Vater und seinen Sohn, die nach Rhodos kommen. Der Sohn wirkt müde, kraftlos, als hätte die Zukunft ihre Konturen verloren. Der Vater trägt vor allem eines mit sich: Hoffnung.

Am Abend fahren beide nach Rhodos-Stadt. Die Gassen sind voller Menschen, Stimmen, Musik, Gläser und warmer Nachtluft. Zwischen zwei Flaschen griechischem Bier geschieht nichts Spektakuläres – und gerade deshalb etwas Entscheidendes.

Der Sohn beginnt zu erzählen.

Von Ideen.
Von Plänen.
Von Morgen.

Und irgendwann lacht er wieder.

Helios gibt ihm dabei kein neues Licht. Er erkennt nur, was noch da ist.

Als der Vater ihn fragt:

„Was hast du mit ihm gemacht?“

antwortet Helios:

„Nichts.
Licht lässt sich nicht verschenken.
Ich hielt nur die Nacht lange genug offen.“

So wird der alte Mythos von Rhodos zum Spiegel einer persönlichen Erfahrung: Etwas kann unsichtbar werden, ohne verschwunden zu sein.

Manchmal braucht es keinen großen Wendepunkt.

Nur eine Insel.
Eine warme Nacht.
Zwei Menschen an einem Tisch.
Und einen Augenblick, in dem unter dem Wasser wieder Land erscheint.

Genre: Cinematic Rhodian Future Garage / Helian Mediterranean UK Garage
Tempo: ca. 129,2 BPM
Tonal Center: F minor, mit modalen und griechisch-mediterranen Einflüssen
Länge: 6:11,95 Minuten
Sprache: Deutsch mit griechischem Intro, Chorus und dezenten griechischen Vocal-Echos

#BisUnterDemWasserWiederLandErscheint #Helios #Rhodos #Rhodes #FutureGarage #GreekMythology #GreekFutureGarage #MediterraneanElectronica #Ritual2Step #FatherAndSon #CinematicMusic #GreekMusic #FREIBERGER', NULL, '6', NULL, '1', '0', '8', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('50', 'der-puls-der-uns-verband', 'Der Puls, der uns verband', 'Eine Erinnerung an Kos & Nisyros', 'song', '2026-03-01', '/covers/songs/der-puls-der-uns-verband.jpg', 'gonZwH0MBlU', 'PLIcnGWUVhwf4', 'German Future Garage / 2-Step', '126', '05:51', 'DER PULS, DER UNS VERBAND erzählt von Kos als einem Ort des Anfangs, der Erinnerung und neuer Kraft.', 'Im Mittelpunkt steht ein junger Hippokrates – noch nicht der berühmte Heiler, sondern ein neugieriger, energiegeladener Mann, der zum ersten Mal den Puls eines Menschen spürt und über das Geheimnis des Lebens staunt. Seine Geschichte verbindet sich mit einem ganz persönlichen Moment: Auf Kos begann das Leben eines Sohnes, noch bevor sein erster Herzschlag hörbar war.

Zwischen Vater, Sohn und Hippokrates entstehen drei Anfänge unter demselben ägäischen Licht. Kos wird dabei nicht nur zur Insel der Erinnerung, sondern zu einem lebendigen inneren Kraftort, an den man zurückkehrt, wenn der Alltag die eigene Weite zu eng werden lässt.

Die Reise führt weiter nach Nisyros, wo selbst die Erde unter dem vulkanischen Stein zu atmen scheint. Der menschliche Puls verbindet sich mit dem Rhythmus des Meeres, der Inseln und der Zeit.

Musikalisch vereint der Song mystischen German Future Garage mit gebrochenem 2-Step, tiefem Reese-Bass, Dodekanes-Violine, Laouto, Lyra, Tsabouna-Klängen und griechischen Ritualgesängen.

Kos ruft nicht. Kos schlägt.

#DerPulsDerUnsVerband #FREIBERGER #FutureGarage #GermanFutureGarage #Kos #Nisyros #Hippokrates #GreekMusic #Dodecanese #AegeanMusic #MysticalMusic #ElectronicMusic #RitualMusic #FatherAndSon #NewLife #GreekIslands', NULL, '7', NULL, '1', '0', '9', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('51', 'was-das-meer-bewahrte', 'Was das Meer bewahrte', 'Between horizon and stone', 'song', '2026-03-01', '/covers/songs/was-das-meer-bewahrte.jpg', 'UbpEoFPuQEo', 'PLIcnGWUVhwf4', 'Cinematic Ritual Future Garage', '129', '06:10', '"Was das Meer bewahrte" erzählt die Geschichte der jungen Mnemosyne – lange bevor sie zur zeitlosen Göttin der Erinnerung wird.', 'Zu Beginn versteht sie ihre Gabe selbst noch nicht. Sie erinnert sich an jeden Regen auf Stein, an jeden flüchtigen Klang, an jedes Licht, das sonst niemand bemerkt. Was für andere vergeht, bleibt in ihr zurück.

Ihre Mutter Gaia gibt ihr eine erste Antwort auf die Frage, was Erinnerung überhaupt ist:

Das, was bleibt, bevor du weißt, dass etwas gehen wird.

Neun Nächte später beginnt sich Mnemosynes Welt zu verändern. Aus Erinnerung entstehen Stimmen – die späteren neun Musen. Musik, Dichtung, Wissen und Geschichten werden damit nicht nur zu Kunst, sondern zu etwas, das aus dem Erinnern selbst geboren wird.

Jahrtausende später hört Mnemosyne eine andere Geschichte: Motoren, Inseln, Sommer, vier Stimmen – und viele Jahre danach nur noch zwei Schatten auf denselben Wegen.

Ein Platz bleibt leer.

Doch die Erinnerung kennt keine einfachen Zahlen.

Was verschwunden scheint, lebt in Stimmen, Straßen, Steinen und Menschen weiter.

Im Zentrum des Songs öffnet sich die Erinnerung wie ein Spiegel im Spiegel:

Eine Welle trägt einen Sommer.
Der Sommer trägt eine Straße.
Die Straße trägt einen Motor.
Der Motor trägt vier Stimmen.
Und tief in der Welle wartet Mnemosyne selbst.

Dann erscheint Lethe – die Stimme des Vergessens.

Sie verspricht Ruhe.

Vergessen wäre leichter.

Doch Mnemosyne entscheidet sich dagegen.

Nicht weil Erinnerung verhindert, dass etwas verloren geht, sondern weil selbst das Verlorene noch etwas Neues hervorbringen kann.

Etwas geht hinein als Verlust
und kehrt als Stimme zurück.

Am Ende erkennt Mnemosyne schließlich, was sie wirklich ist:

„Ihr dachtet, das Meer hätte euch erinnert.
Ich war das Meer.“

„Was das Meer bewahrte“ ist ein Song über Erinnerung, Verlust und die Kraft von Kunst. Über Menschen, die weitergehen, während frühere Versionen ihrer selbst in ihnen weiterleben. Und über die Frage, ob etwas wirklich verschwunden ist, solange es noch in einer Geschichte, einem Lied oder einem anderen Menschen weiterklingt.

Genre: Cinematic Ritual Future Garage / Mythic Mediterranean UK Garage
Tempo: ca. 129,2 BPM
Tonal Center: F minor, mit modalen und griechisch-mediterranen Einflüssen
Länge: 6:09,6 Minuten
Sprache: Deutsch mit zurückhaltenden griechischen Chants

#WasDasMeerBewahrte #Mnemosyne #FutureGarage #GreekMythology #GreekFutureGarage #Lethe #Muses #Gaia #Memory #Ritual2Step #MediterraneanElectronica #MythicElectronica #CinematicMusic #GreekMusic #FREIBERGER', NULL, '1', NULL, '1', '0', '10', '2026-09-07 15:01:14', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('52', 'hoerbuch-kapitel-01-athen', 'Kapitel 1: Die Stadt Über der Stadt', 'Eine Erinnerung an Athen', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/I2ZmUlL5JWw/mqdefault.jpg', 'I2ZmUlL5JWw', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '13:54', 'Die Stadt über der Stadt – Eine Erinnerung an Athen
Es gibt Reisen, die erst Jahre später ihre wahre Bedeutung entfalten. Dieses Kapitel ist der literarische Nachhall einer solchen Reise nach Athen.', 'Wir waren jung, hatten es nicht eilig und ließen uns einfach treiben. Über uns die Welt der Götter und des Marmors, unter uns die Agora – der staubige, laute Raum der Menschen. In Athen stehen Mythen und Alltag direkt nebeneinander.

Die Erzählung handelt von zwei Gesichtern derselben Reise: Dem ruhigen, fast ewigen Nachmittag auf dem warmen Fels des Areopag, wo ein 17-jähriger Junge in die Sonne blinzelt und keine Zukunft braucht. Und der darauffolgenden Nacht in Dafni, voller Wein, Musik und Maßlosigkeit.

Vielleicht verschwinden die alten Götter nicht. Athena beobachtet still die Reisenden zwischen den Ruinen, und Dionysos findet man auf den lauten Festen der Nacht. Diese Geschichte ist eine Hommage an die Widersprüche, die uns ganz machen: den Menschen, der nachdenkt, und den, der tanzt.

Am Ende bleibt das Licht auf dem Felsen und eine Stadt, die uns nicht braucht, um weiterzumachen. Aber ein Teil von ihr reist für immer mit uns.

#FREIBERGER #GARD7 #Athen #GriechenlandReise #DieStadtÜberDerStadt #Hörbuch #Audiobook #Storytelling #Erinnerungen #Akropolis #Areopag #Dionysos', NULL, '3', '36', '2', '0', '101', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('53', 'hoerbuch-kapitel-02-zakynthos', 'Kapitel 2: Jung genug dem Horizont zu glauben', 'Eine Erinnerung an Zakynthos', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/urRrHeHx3MM/mqdefault.jpg', 'urRrHeHx3MM', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '12:39', 'Jung genug, dem Horizont zu glauben – Eine Erinnerung an Zakynthos
Das Meer sah vom Ufer aus harmlos aus. Dieses Kapitel ist die literarische Rückkehr zu einem Sommertag auf Zakynthos, an dem drei 17-Jährige beschlossen, einfach zur Insel Marathonisi hinauszuschwimmen.', 'Die Erzählung fängt den Kontrast dieses Tages ein: Der unbeschwerte Beginn spiegelt den jugendlichen Übermut und das Vertrauen in den eigenen Körper wider. Doch je weiter das Ufer verschwindet, desto tiefer und bedrohlicher wird die Situation – genau wie das Meer, das plötzlich seine unerbittliche Größe zeigt.

Zwischen Erschöpfung und dem rettenden Land entsteht ein stummer Dialog mit der Göttin Artemis. Sie rettet uns nicht, denn nicht jede Bewährungsprobe ist ein Mythos. Manchmal waren wir einfach nur jung. Eine Geschichte über den unbändigen Willen, in der Ferne eine Möglichkeit statt eines Risikos zu sehen, und über das trügerische Blau des Mittelmeers, das am Ende vielleicht uns durchquert hat, anstatt wir es.

#FREIBERGER #GARD7 #Zakynthos #Marathonisi #DieStadtÜberDerStadt #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Artemis #Jugend #Horizont', NULL, '4', '37', '2', '0', '102', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('54', 'hoerbuch-kapitel-03-korfu', 'Kapitel 3: Grün das keinen Horizont brauchte', 'Eine Erinnerung an Korfu', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/VLXu_1GVqn0/mqdefault.jpg', 'VLXu_1GVqn0', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '9:54', 'Grün, das keinen Horizont brauchte – Eine Erinnerung an Korfu
Manchmal führt der Weg nach Griechenland nicht zuerst ins Blau, sondern ins Grün. Dieses Kapitel ist der literarische Nachhall einer langen Reise: Von der endlosen Straße durch Italien über das schwarze Wasser der Nachtfähre bis in den feuchten, stillen Nebel von Korfu.', 'Nach der hitzigen Unruhe Athens und dem offenen Meer von Zakynthos ist dieses Stück der Geschichte eine Atempause. Die Erzählung spiegelt die zwei Gesichter dieser Insel wider: Die tiefe, erdende Ruhe an einem alten Farmhaus im Tal, wo die Welt für einen Moment stillzustehen scheint, und das erhabene Gefühl der vollkommenen Weite oben auf dem Pantokrator.

In der Begegnung mit der unsichtbaren Korkyra wächst eine leise Erkenntnis heran, die sich durch die Geschichte zieht: Ein Ort braucht uns nicht, um weiterzumachen. Und das, was wir lieben, muss nicht bei uns bleiben, um für immer in uns zu bleiben. Ein Kapitel über das Loslassen und die friedliche Gewissheit, dass Erinnerungen ihre eigene Zeitrechnung haben. Auf in Richtung Naxos.

#FREIBERGER #GARD7 #Korfu #Korkyra #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Pantokrator #DieStadtÜberDerStadt #ReiseTagebuch', NULL, '8', '38', '2', '0', '103', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('55', 'hoerbuch-kapitel-04-piraeus-naxos', 'Kapitel 4: Die Ader hinaus in die Welt', 'Von Athen nach Naxos', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/GrMC4veUf54/mqdefault.jpg', 'GrMC4veUf54', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '9:51', 'Die Ader hinaus in die Welt – Von Athen nach Naxos
Manche Orte sind keine Ziele, sondern Türen. Dieses Kapitel ist der literarische Übergang zwischen zwei Welten: der Ankunft im lauten, vertrauten Athen und dem Aufbruch am Hafen von Piräus.', 'Mit 23 Jahren zurück in einer Stadt, in der man mit 17 schon einmal war, bewegen wir uns plötzlich auf zwei Zeitlinien gleichzeitig. Die Erzählung fängt genau diesen Rhythmus ein – das pulsierende Treiben am Kai, die schweren Fähren im Wasser und das Gefühl, dass sich mit dem Ablegen die Welt erneut öffnet.

In einer stillen Begegnung am Hafen erklärt Athena: Ein Ort, der dich nur behalten will, ist kein Hafen, sondern eine Mauer. Dieses Kapitel ist all jenen Momenten gewidmet, in denen wir uns „dazwischen“ befinden. Auf dem Wasser, wenn das alte Ufer verschwindet und Naxos noch nicht in Sicht ist. Ein erzählerischer Treibstoff für den Weg hinaus ins offene Meer – und eine Hommage an die früheren Versionen unserer selbst, die wir an solchen Orten zurücklassen.

#FREIBERGER #GARD7 #Piräus #Athen #Naxos #DieStadtÜberDerStadt #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Athena #Ägäis', NULL, '3', '39', '2', '0', '104', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('56', 'hoerbuch-kapitel-05-naxos', 'Kapitel 5: Stimmen unter freiem Himmel', 'Eine Erinnerung an Naxos', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/mMTEOXCLV-w/mqdefault.jpg', 'mMTEOXCLV-w', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '13:28', 'Stimmen unter freiem Himmel – Eine Erinnerung an Naxos
Manche Sommer wissen noch nicht, dass sie einmal zur Erinnerung werden. Dieses Kapitel des Hörbuchs ist eine Rückkehr auf die Insel Naxos: Fahrtwind auf Motorrädern, der Staub der Straßen, weiße Gassen in Chora und Nächte im Schlafsack unter dem Sternenhimmel.', 'Die Erzählung fängt das pure, rastlose Lebensgefühl einer Zeit ein, in der Freundschaft keine große Handlung brauchte. Man fuhr einfach, weil die Straße da war. Wenn sich die Geschichte weitet und den Blick freigibt, stehen wir gedanklich vor der Portara – jenem gewaltigen, unvollendeten Marmortor am Rand der Stadt. Ein Tor ohne Raum, durch das wir damals auf den Horizont blickten, ohne zu ahnen, was die Zukunft bringen würde.

Eine literarische Hommage an die absolute Freiheit der Kykladen, an Dionysos und an jene Tage, an denen das Leben einfach vor uns lag.', NULL, '1', '40', '2', '0', '105', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('57', 'hoerbuch-kapitel-06-santorini', 'Kapitel 6: Wir hielten uns fuer unsterblich', 'Eine Erinnerung an Santorini', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/8uwf-8kQZDI/mqdefault.jpg', '8uwf-8kQZDI', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '11:53', 'Der Sprung und der Fall – Eine Erinnerung an Santorini
Damals glaubten wir noch, Freiheit bedeute vor allem, dass uns nichts halten konnte. Dieses Kapitel des Hörbuchs nimmt uns mit auf die Klippen von Santorini. Vor der Kulisse leuchtend weißer Häuser auf schwarzem Vulkangestein geht es um jene Form der Unverwundbarkeit, die vielleicht nur der Jugend gehört.', 'Die Erzählung fängt diesen winzigen, schwerelosen Moment ein: den halben Herzschlag zwischen dem festen Stein unter den Füßen und dem Eintauchen in das kühle Wasser der Ägäis. Wir sprangen, weil wir glaubten, das Leben läge überall vor uns. Doch in einer nachdenklichen Begegnung mit der mythischen Figur des Hephaistos offenbart sich ein leiser Vorbote der Zukunft. Er stellt die entscheidende Frage nach dem Unterschied zwischen dem mutigen, freiwilligen Sprung und dem schmerzhaften, unfreiwilligen Fall.

Ein literarisches Kapitel über das blinde Vertrauen in den eigenen Körper, die Schönheit von Gegensätzen und darüber, dass manche Veränderungen im Leben keinen Anlauf brauchen. Nächster Halt: Kreta.

#FREIBERGER #GARD7 #Santorini #Hephaistos #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Kykladen #Klippenspringen #Jugend #ReiseTagebuch', NULL, '2', '41', '2', '0', '106', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('58', 'hoerbuch-kapitel-07-kreta', 'Kapitel 7: Drei Motoren unter einem jungen Himmel', 'Eine Erinnerung an Kreta', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/HWdVFh4Iq_Y/mqdefault.jpg', 'HWdVFh4Iq_Y', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '11:51', 'Drei Motoren unter einem jungen Himmel – Eine Erinnerung an Kreta
Manche Reisen beginnen nicht mit einem Plan, sondern mit dem einfachen Entschluss, loszufahren. Dieses Kapitel des Hörbuchs nimmt uns mit auf drei Motorrädern quer über die Insel Kreta. Vom warmen Gegenwind auf den Straßen über das leuchtende Blau von Elafonissi bis in die gewaltige Stille der Samaria-Schlucht.', 'Doch hinter der Kulisse dieser unbeschwerten Freiheit verbirgt sich eine der schwersten und schönsten Aufgaben der Erinnerung. Einer der drei Freunde von damals lebt heute nicht mehr. In einer stillen, literarischen Begegnung mit der mythischen Rhea am Straßenrand entfaltet sich eine tief berührende Erkenntnis: Wir dürfen den Tod eines Menschen anerkennen, ohne ihm rückwirkend sein ganzes Leben zu überlassen. Wir erinnern nicht sein Fehlen, sondern seinen Platz zwischen uns.

Ein Kapitel als erzählerisches Denkmal für eine Freundschaft. Ein Sommer, in dem niemand fehlte. In dieser Geschichte werden für immer drei Motoren fahren.

#FREIBERGER #GARD7 #Kreta #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #MotorradTour #Rhea #Freundschaft #Trauerarbeit #Roadtrip #ReiseTagebuch', NULL, '5', '42', '2', '0', '107', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('59', 'hoerbuch-kapitel-08-santorini-die-hand', 'Kapitel 8: Die Hand die bleibt', 'Eine Erinnerung an Santorini', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/CPVQnyswU3k/mqdefault.jpg', 'CPVQnyswU3k', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '10:57', 'Die Hand, die bleibt – Eine Erinnerung an Santorini
Irgendwann wird das Leben größer als die Reise. Dieses Kapitel des Hörbuchs erzählt von der Rückkehr nach Santorini – elf Jahre nach dem ersten unbeschwerten Sommer. Die wilden Klippensprünge der Jugend weichen einer leiseren, aber nicht minder intensiven Reise an der Seite der eigenen Frau.', 'Die Erzählung verwebt die weiße Schönheit und den dunklen Vulkanstein der Insel mit tiefen Reflexionen über das Erwachsenwerden. Aus dem ungebundenen Drang nach Freiheit wird die Erkenntnis, dass auch das Bleiben und die Verbundenheit eine eigene Form von Freiheit sind. In einem philosophischen Dialog mit Hephaistos und Hera geht es um die Verantwortung, die Hände plötzlich tragen können – vom Reichen einer Hand am Pool bis zum Halten des eigenen Kindes. Ein berührendes Kapitel über das Reifen, die Liebe und die Kunst, nicht mehr loszulassen. Nächster Halt: Naxos.

#FREIBERGER #GARD7 #Santorini #Hephaistos #Hera #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Kykladen #Erwachsenwerden #ReiseTagebuch', NULL, '2', '43', '2', '0', '108', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('60', 'hoerbuch-kapitel-09-naxos-das-tor', 'Kapitel 9: Das Tor das uns wiedersah', 'Eine Erinnerung an Naxos', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/JkwbHZNVkBQ/mqdefault.jpg', 'JkwbHZNVkBQ', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '10:58', 'Das Tor, das uns wiedersah – Eine Erinnerung an Naxos
Manche Orte besuchen wir nicht, um uns an sie zu erinnern, sondern um uns an uns selbst zu erinnern. Dieses Kapitel des Hörbuchs erzählt von der Rückkehr nach Naxos – zurück in die weißen Gassen von Chora, zurück zur gewaltigen Portara.', 'Doch die Insel empfängt einen anderen Menschen als beim ersten Besuch. Wo einst junge Männer auf Motorrädern die absolute Freiheit suchten, kehrt nun ein Mann an der Seite seiner Frau zurück. Die Erinnerung legt zwei Leben übereinander. Die Leichtigkeit der Vergangenheit trifft auf die Schwere der Gegenwart, als an einem warmen Abend auf einer Dachterrasse eine Nachricht vom Tod eines Freundes die Zeit in ein Davor und Danach spaltet.

Ein literarischer Dialog mit Dionysos und Ariadne über Treue zu sich selbst, den Schmerz des Verlassens und die Frage, wer wir durch all diese Veränderungen geworden sind. Ein Kapitel über das Bleiben, das Weitergehen und das Marmortor, das uns wie ein Spiegel ohne Glas betrachtet.

#FREIBERGER #GARD7 #Naxos #Portara #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Dionysos #Ariadne #Trauerarbeit #Veränderung #ReiseTagebuch', NULL, '1', '44', '2', '0', '109', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('61', 'hoerbuch-kapitel-10-kos', 'Kapitel 10: Vor dem ersten Schlag', 'Eine Erinnerung an Kos', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/bAA6AuI6dlE/mqdefault.jpg', 'bAA6AuI6dlE', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '9:42', 'Vor dem ersten Schlag – Eine Erinnerung an Kos
Manche Orte bewahren, wer wir einmal waren. Andere werden Teil eines Menschen, bevor dieser überhaupt eine eigene Erinnerung besitzen kann. Dieses Kapitel des Hörbuchs erzählt von einer Reise nach Kos – der Insel, auf der aus zwei Menschen leise drei wurden.', 'In einer Zeit, in der die unbeschwerten Reisen der Jugend der tiefen Verbundenheit als Paar gewichen sind, bekommt Kos eine besondere, fast unsichtbare Bedeutung. Es ist der Ort eines Anfangs. In einer literarischen Begegnung mit dem jungen Hippokrates geht es um die Frage, wann das Leben beginnt – und um die leise Aufmerksamkeit, die es braucht, um den ersten Takt wahrzunehmen. Ein Kapitel über das Werden, das Begleiten und die Erkenntnis, dass die größten Veränderungen im Leben oft völlig lautlos beginnen.

#FREIBERGER #GARD7 #Kos #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Hippokrates #Familie #ElternWerden #VaterSohn #ReiseTagebuch', NULL, '7', '45', '2', '0', '110', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('62', 'hoerbuch-kapitel-11-rhodos', 'Kapitel 11: Zwei Flaschen auf einem Tisch', 'Eine Erinnerung an Rhodos', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/qpP2dMpT_q4/mqdefault.jpg', 'qpP2dMpT_q4', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '10:01', 'Zwei Flaschen auf einem Tisch – Eine Erinnerung an Rhodos
Einen Menschen zu lieben bedeutet nicht, sein Leben für ihn leben zu können. Dieses Kapitel des Hörbuchs erzählt von einer Reise nach Rhodos – Vater und Sohn an einem Tisch in den belebten Gassen der Altstadt.', 'Es ist die Geschichte einer leisen Hoffnung: Dass die verloren gegangene Energie und Lebensfreude eines jungen Menschen wieder sichtbar werden. Zwischen zwei Flaschen Bier, dem Gemurmel der vollen Tavernen und der warmen griechischen Nacht geschieht kein lautes Wunder, sondern etwas viel Größeres: Ein Gespräch beginnt, ein Lachen kehrt zurück, und in der Stimme des Sohnes bekommt die Zukunft wieder Raum. In einer nachdenklichen Begegnung mit Helios, dem Gott der Sonne, wächst die Erkenntnis, dass Eltern das Licht ihrer Kinder nicht einschalten können. Man kann nur da sein, zuhören und begleiten, wenn sie selbst den Weg nach vorn finden.

Ein zutiefst persönliches Kapitel über Fürsorge, das Vertrauen in den Weg des anderen und den Moment, in dem das Morgen wieder eine Linie am Horizont wird.

#FREIBERGER #GARD7 #Rhodos #Helios #VaterSohn #Hörbuch #Audiobook #Storytelling #Erinnerungen #GriechenlandReise #Loslassen #Zukunft #ReiseTagebuch', NULL, '6', '46', '2', '0', '111', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('63', 'hoerbuch-epilog-was-das-meer-bewahrte', 'Epilog Was das Meer bewahrte', 'Ein Rückblick auf Griechenland', 'audiobook', '2026-03-01', 'https://i.ytimg.com/vi/lxnDT15eI5c/mqdefault.jpg', 'lxnDT15eI5c', 'PLYjciFHvZoyU', 'Hörbuch / Autorenlesung', NULL, '7:14', 'Was das Meer bewahrte – Ein Rückblick auf Griechenland
„Warum müsste etwas ewig sein, um wirklich gewesen zu sein?“ Dieses abschließende Kapitel des Hörbuchs bündelt alle Fäden der Reise: von den unbeschwerten Motorradfahrten der Jugend auf Naxos und Kreta über die Rückkehr als Vater nach Kos und Rhodos bis hin zu den unauslöschlichen Momenten von Liebe und Verlust.', 'Die Erinnerung funktioniert nicht wie ein Archiv. Sie ist wie das Meer – keine Welle bleibt, und doch bleibt das Ganze. In einer letzten, tiefgründigen Begegnung mit Mnemosyne, der Göttin der Erinnerung, und Lethe, dem Vergessen, wird deutlich, dass das Bewahren nicht bedeutet, nichts zu verlieren. Es bedeutet, dass das, was war, nicht verschwindet, auch wenn es seine Form ändert. Eine literarische Reise, die dort endet, wo sie begann: beim Meer. Ein würdiger Abschluss über das Leben, das Werden und die Erkenntnis, dass wir nicht alles tragen müssen.

#FREIBERGER #GARD7 #Hörbuch #Audiobook #Storytelling #GriechenlandReise #Erinnerungen #Mnemosyne #DasMeer #Lebensreise #Veränderung #ReiseTagebuch #Loslassen #Trauerarbeit', NULL, '1', '47', '2', '0', '112', '2026-09-07 15:01:14', NULL, NULL, '');
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('64', 'the-light-we-carry', 'The Light We Carry', 'GARD 7', 'gard7', NULL, '/covers/gard7/the-light-we-carry.jpg', 'SWYXBXpnjNc', NULL, 'Melodic / Electronic', '126', '03:45', 'Offizielles Song-Video von GARD 7.', NULL, NULL, NULL, NULL, '3', '0', '1', '2026-09-07 18:46:17', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('65', 'until-the-dream', 'Until the Dream', 'GARD 7', 'gard7', NULL, '/covers/gard7/until-the-dream.jpg', '7vgbX3OljBI', NULL, 'Atmospheric Electronic', '124', '03:52', 'Offizielles Song-Video von GARD 7.', NULL, NULL, NULL, NULL, '3', '0', '2', '2026-09-07 18:46:18', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('66', 'heart-on-the-court', 'Heart on the Court', 'GARD 7', 'gard7', NULL, '/covers/gard7/heart-on-the-court.jpg', 'NiVTom43ReQ', NULL, 'Modern Electronic / Beats', '128', '03:38', 'Offizielles Song-Video von GARD 7.', NULL, NULL, NULL, NULL, '3', '0', '3', '2026-09-07 18:46:18', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('67', 'head-turns-to-stone', 'Head Turns to Stone', 'GARD 7', 'gard7', NULL, '/covers/gard7/head-turns-to-stone.jpg', 'qrtKV_jNzrE', NULL, 'Dark Electronic / Bass', '130', '03:42', 'Offizielles Song-Video von GARD 7.', NULL, NULL, NULL, NULL, '3', '0', '4', '2026-09-07 18:46:18', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('68', 'livre-audio-chapitre-01', 'Chapitre 1 : La ville au-dessus de la ville', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/CdtL5RiTg8s/mqdefault.jpg', 'CdtL5RiTg8s', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '12:35', NULL, NULL, NULL, NULL, NULL, '4', '0', '201', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('69', 'livre-audio-chapitre-02', 'Chapitre 2 : Assez jeune pour croire à l''horizon', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/CU29i6BgdBA/mqdefault.jpg', 'CU29i6BgdBA', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '11:37', NULL, NULL, NULL, NULL, NULL, '4', '0', '202', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('70', 'livre-audio-chapitre-03', 'Chapitre 3 : Un vert qui n''avait pas besoin d''horizon', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/5LQCHyfnoGE/mqdefault.jpg', '5LQCHyfnoGE', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '9:00', NULL, NULL, NULL, NULL, NULL, '4', '0', '203', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('71', 'livre-audio-chapitre-04', 'Chapitre 4 : L''artère vers le large', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/_b-_FC8MZSA/mqdefault.jpg', '_b-_FC8MZSA', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '8:53', NULL, NULL, NULL, NULL, NULL, '4', '0', '204', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('72', 'livre-audio-chapitre-05', 'Chapitre 5 : Des voix sous le ciel', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/JW-mJ794tj4/mqdefault.jpg', 'JW-mJ794tj4', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '12:20', NULL, NULL, NULL, NULL, NULL, '4', '0', '205', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('73', 'livre-audio-chapitre-06', 'Chapitre 6 : Nous nous croyions immortels', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/FJ2T3OxUXkI/mqdefault.jpg', 'FJ2T3OxUXkI', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '10:43', NULL, NULL, NULL, NULL, NULL, '4', '0', '206', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('74', 'livre-audio-chapitre-07', 'Chapitre 7 : Trois moteurs sous un ciel encore jeune', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/Ky4fEXpgXFI/mqdefault.jpg', 'Ky4fEXpgXFI', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '10:56', NULL, NULL, NULL, NULL, NULL, '4', '0', '207', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('75', 'livre-audio-chapitre-08', 'Chapitre 8 : La main qui reste', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/UgK_Cbzeh5c/mqdefault.jpg', 'UgK_Cbzeh5c', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '10:02', NULL, NULL, NULL, NULL, NULL, '4', '0', '208', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('76', 'livre-audio-chapitre-09', 'Chapitre 9 : La porte qui nous a vus revenir', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/eo_oUePaY-Y/mqdefault.jpg', 'eo_oUePaY-Y', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '9:57', NULL, NULL, NULL, NULL, NULL, '4', '0', '209', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('77', 'livre-audio-chapitre-10', 'Chapitre 10 : Avant le premier battement', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/8_8XOOE7G3A/mqdefault.jpg', '8_8XOOE7G3A', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '8:34', NULL, NULL, NULL, NULL, NULL, '4', '0', '210', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('78', 'livre-audio-chapitre-11', 'Chapitre 11 : Deux bouteilles sur une table', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/NyMxu-8f6Tk/mqdefault.jpg', 'NyMxu-8f6Tk', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '9:24', NULL, NULL, NULL, NULL, NULL, '4', '0', '211', '2026-10-11 14:52:43', NULL, NULL, NULL);
INSERT INTO releases (id, slug, title, subtitle, type, release_date, cover, youtube_id, youtube_playlist_id, genre, bpm, duration, description, story, lyrics, place_id, chapter_id, series_id, featured, sort_order, created_at, spotify_url, apple_music_url, audio_url) VALUES ('79', 'livre-audio-chapitre-12', 'Épilogue : Ce que la mer a gardé', NULL, 'audiobook', NULL, 'https://i.ytimg.com/vi/yZN8i-Ch2ME/mqdefault.jpg', 'yZN8i-Ch2ME', 'PLbf_CjWtjwr0', 'Livre audio', NULL, '6:36', NULL, NULL, NULL, NULL, NULL, '4', '0', '212', '2026-10-11 14:52:43', NULL, NULL, NULL);

