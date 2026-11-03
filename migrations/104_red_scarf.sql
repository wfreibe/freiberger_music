ALTER TABLE books ADD COLUMN purchase_url TEXT;
ALTER TABLE books ADD COLUMN songs_playlist_url TEXT;
ALTER TABLE books ADD COLUMN audiobook_playlist_url TEXT;
ALTER TABLE books ADD COLUMN film_url TEXT;

UPDATE books SET purchase_url='https://www.epubli.com/?s=Werner+Freiberger' WHERE purchase_url IS NULL;

INSERT OR IGNORE INTO books (slug,title,author,language,menu_label,sort_order,formats,purchase_url,songs_playlist_url,audiobook_playlist_url,film_url)
VALUES ('der-rote-schal','Der rote Schal','Werner Freiberger','de','DER ROTE SCHAL',40,'BUCH · HÖRBUCH DE · MUSIK · FILM',
'https://www.epubli.com/?s=Werner+Freiberger','https://www.youtube.com/playlist?list=PLZZxqjAKPSZo','https://www.youtube.com/playlist?list=PLP8djEaASfxE','https://www.youtube.com/playlist?list=PLefRR8TMnDiU');
INSERT OR IGNORE INTO books (slug,title,author,language,menu_label,sort_order,formats,purchase_url,songs_playlist_url,audiobook_playlist_url,film_url)
VALUES ('l-echarpe-rouge','L’Écharpe rouge','Werner Freiberger','fr','L’ÉCHARPE ROUGE',50,'LIVRE · LIVRE AUDIO DE · MUSIQUE · FILM',
'https://www.epubli.com/?s=Werner+Freiberger','https://www.youtube.com/playlist?list=PLZZxqjAKPSZo','https://www.youtube.com/playlist?list=PLP8djEaASfxE','https://www.youtube.com/playlist?list=PLefRR8TMnDiU');
INSERT OR IGNORE INTO books (slug,title,author,language,menu_label,sort_order,formats,purchase_url,songs_playlist_url,audiobook_playlist_url,film_url)
VALUES ('the-red-scarf','The Red Scarf','Werner Freiberger','en','THE RED SCARF',60,'BOOK · AUDIOBOOK DE · MUSIC · FILM',
'https://www.epubli.com/?s=Werner+Freiberger','https://www.youtube.com/playlist?list=PLZZxqjAKPSZo','https://www.youtube.com/playlist?list=PLP8djEaASfxE','https://www.youtube.com/playlist?list=PLefRR8TMnDiU');
