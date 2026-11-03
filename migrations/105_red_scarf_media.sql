-- Public YouTube playlist snapshot: 2026-11-03; preserve existing CMS records.

INSERT OR IGNORE INTO series (slug,title,sort_order) VALUES ('der-rote-schal-soundtrack','DER ROTE SCHAL · CHANSONS',5);

INSERT OR IGNORE INTO series (slug,title,sort_order) VALUES ('hoerbuch-der-rote-schal','DER ROTE SCHAL · HÖRBUCH DE',6);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-01','Ton nom sous le mien','song','Chanson français','jOs8Onr2OGk','PLZZxqjAKPSZo','4:01','https://i.ytimg.com/vi/jOs8Onr2OGk/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,1);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-02','La maille reprise','song','Chanson français','yp_tqAPo5R8','PLZZxqjAKPSZo','4:04','https://i.ytimg.com/vi/yp_tqAPo5R8/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,2);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-03','L’écharpe rouge','song','Chanson français','ZX7Lf_DaAj0','PLZZxqjAKPSZo','4:50','https://i.ytimg.com/vi/ZX7Lf_DaAj0/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,3);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-04','Entre deux arbres','song','Chanson français','M7eLFLAp3Ps','PLZZxqjAKPSZo','4:37','https://i.ytimg.com/vi/M7eLFLAp3Ps/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,4);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-05','L’embranchement','song','Chanson français','vlge0nd7wvw','PLZZxqjAKPSZo','4:57','https://i.ytimg.com/vi/vlge0nd7wvw/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,5);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-06','La signature','song','Chanson français','9GZLvUnbTSE','PLZZxqjAKPSZo','4:20','https://i.ytimg.com/vi/9GZLvUnbTSE/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,6);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-song-07','Le fil rouge','song','Chanson français','pSRhiHuUAKk','PLZZxqjAKPSZo','5:09','https://i.ytimg.com/vi/pSRhiHuUAKk/mqdefault.jpg',(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'),NULL,7);

INSERT INTO chapters (book_id,chapter_number,title,sort_order) SELECT id,1,'Der Rote Schal | Kapitel 01 | Innach',1 FROM books WHERE slug='der-rote-schal' AND NOT EXISTS (SELECT 1 FROM chapters c WHERE c.book_id=books.id AND c.chapter_number=1);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-kapitel-01','Der Rote Schal | Kapitel 01 | Innach','audiobook','Hörbuch DE','XWCJ6cE1mWo','PLP8djEaASfxE','25:22','https://i.ytimg.com/vi/XWCJ6cE1mWo/mqdefault.jpg',(SELECT id FROM series WHERE slug='hoerbuch-der-rote-schal'),(SELECT c.id FROM chapters c JOIN books b ON c.book_id=b.id WHERE b.slug='der-rote-schal' AND c.chapter_number=1 LIMIT 1),1);

INSERT INTO chapters (book_id,chapter_number,title,sort_order) SELECT id,2,'Der Rote Schal | Kapitel 02 | Bei Penzing',2 FROM books WHERE slug='der-rote-schal' AND NOT EXISTS (SELECT 1 FROM chapters c WHERE c.book_id=books.id AND c.chapter_number=2);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-kapitel-02','Der Rote Schal | Kapitel 02 | Bei Penzing','audiobook','Hörbuch DE','ZowSUTMRbKg','PLP8djEaASfxE','29:43','https://i.ytimg.com/vi/ZowSUTMRbKg/mqdefault.jpg',(SELECT id FROM series WHERE slug='hoerbuch-der-rote-schal'),(SELECT c.id FROM chapters c JOIN books b ON c.book_id=b.id WHERE b.slug='der-rote-schal' AND c.chapter_number=2 LIMIT 1),2);

INSERT INTO chapters (book_id,chapter_number,title,sort_order) SELECT id,3,'Der Rote Schal | Kapitel 03 | Die Männer in der Stube',3 FROM books WHERE slug='der-rote-schal' AND NOT EXISTS (SELECT 1 FROM chapters c WHERE c.book_id=books.id AND c.chapter_number=3);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-kapitel-03','Der Rote Schal | Kapitel 03 | Die Männer in der Stube','audiobook','Hörbuch DE','9Msq8RqaYbU','PLP8djEaASfxE','33:30','https://i.ytimg.com/vi/9Msq8RqaYbU/mqdefault.jpg',(SELECT id FROM series WHERE slug='hoerbuch-der-rote-schal'),(SELECT c.id FROM chapters c JOIN books b ON c.book_id=b.id WHERE b.slug='der-rote-schal' AND c.chapter_number=3 LIMIT 1),3);

INSERT INTO chapters (book_id,chapter_number,title,sort_order) SELECT id,4,'Der Rote Schal | Kapitel 04 | Haag',4 FROM books WHERE slug='der-rote-schal' AND NOT EXISTS (SELECT 1 FROM chapters c WHERE c.book_id=books.id AND c.chapter_number=4);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-kapitel-04','Der Rote Schal | Kapitel 04 | Haag','audiobook','Hörbuch DE','gS63F3i5eEY','PLP8djEaASfxE','31:13','https://i.ytimg.com/vi/gS63F3i5eEY/mqdefault.jpg',(SELECT id FROM series WHERE slug='hoerbuch-der-rote-schal'),(SELECT c.id FROM chapters c JOIN books b ON c.book_id=b.id WHERE b.slug='der-rote-schal' AND c.chapter_number=4 LIMIT 1),4);

INSERT INTO chapters (book_id,chapter_number,title,sort_order) SELECT id,5,'Der Rote Schal | Kapitel 05 | Die sechs Brote',5 FROM books WHERE slug='der-rote-schal' AND NOT EXISTS (SELECT 1 FROM chapters c WHERE c.book_id=books.id AND c.chapter_number=5);

INSERT OR IGNORE INTO releases (slug,title,type,genre,youtube_id,youtube_playlist_id,duration,cover,series_id,chapter_id,sort_order) VALUES ('der-rote-schal-kapitel-05','Der Rote Schal | Kapitel 05 | Die sechs Brote','audiobook','Hörbuch DE','o3OLzD_AWiA','PLP8djEaASfxE','29:37','https://i.ytimg.com/vi/o3OLzD_AWiA/mqdefault.jpg',(SELECT id FROM series WHERE slug='hoerbuch-der-rote-schal'),(SELECT c.id FROM chapters c JOIN books b ON c.book_id=b.id WHERE b.slug='der-rote-schal' AND c.chapter_number=5 LIMIT 1),5);

UPDATE books SET soundtrack_series_id=(SELECT id FROM series WHERE slug='der-rote-schal-soundtrack'), audiobook_series_id=(SELECT id FROM series WHERE slug='hoerbuch-der-rote-schal') WHERE slug IN ('der-rote-schal','l-echarpe-rouge','the-red-scarf') AND soundtrack_series_id IS NULL AND audiobook_series_id IS NULL;
