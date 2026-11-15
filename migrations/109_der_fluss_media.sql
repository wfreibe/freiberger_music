-- Public YouTube playlist snapshot: 2026-11-15; preserve existing CMS records.

INSERT OR IGNORE INTO series (slug,title,sort_order) VALUES ('der-fluss-kennt-keine-erben-soundtrack','DER FLUSS KENNT KEINE ERBEN · MUSIK',7);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,sort_order) VALUES ('der-fluss-kennt-keine-erben-song-01','Keine Zeit für den Fluss | Musik zum Buch','song','Musik zum Buch','ZDmakXO2KZ4','PLMwXitdFTZtQ','3:39','https://i.ytimg.com/vi/ZDmakXO2KZ4/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-fluss-kennt-keine-erben-soundtrack'),1);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,sort_order) VALUES ('der-fluss-kennt-keine-erben-song-02','Noch nicht | Musik zum Buch','song','Musik zum Buch','Ryqaxa7JcZg','PLMwXitdFTZtQ','3:51','https://i.ytimg.com/vi/Ryqaxa7JcZg/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-fluss-kennt-keine-erben-soundtrack'),2);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,sort_order) VALUES ('der-fluss-kennt-keine-erben-song-03','Ein Sommer aus Mittwochen | Musik zum Buch','song','Musik zum Buch','9G82x8nHDWg','PLMwXitdFTZtQ','3:55','https://i.ytimg.com/vi/9G82x8nHDWg/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-fluss-kennt-keine-erben-soundtrack'),3);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,sort_order) VALUES ('der-fluss-kennt-keine-erben-song-04','Das blaue Band | Musik zum Buch','song','Musik zum Buch','hplR0S7DNto','PLMwXitdFTZtQ','3:45','https://i.ytimg.com/vi/hplR0S7DNto/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-fluss-kennt-keine-erben-soundtrack'),4);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,sort_order) VALUES ('der-fluss-kennt-keine-erben-song-05','Ein Schiff will woanders hin | Musik zum Buch','song','Musik zum Buch','xvWf7O6tRQc','PLMwXitdFTZtQ','3:55','https://i.ytimg.com/vi/xvWf7O6tRQc/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-fluss-kennt-keine-erben-soundtrack'),5);

UPDATE books SET soundtrack_series_id=(SELECT id FROM series WHERE slug='der-fluss-kennt-keine-erben-soundtrack') WHERE slug='der-fluss-kennt-keine-erben' AND soundtrack_series_id IS NULL;
