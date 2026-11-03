ALTER TABLE books ADD COLUMN film_youtube_id TEXT;
ALTER TABLE books ADD COLUMN film_title TEXT;
ALTER TABLE books ADD COLUMN film_duration TEXT;

-- Public film playlist verified 2026-11-03. Preserve independently edited film links.
UPDATE books SET film_youtube_id='rnweaIuC_-Y',
  film_title='Der rote Schal | Hohenlinden 1800 – Ein KI-Antikriegsfilm (Revised Version 3)',
  film_duration='4:27'
WHERE slug IN ('der-rote-schal','l-echarpe-rouge','the-red-scarf')
  AND film_url='https://www.youtube.com/playlist?list=PLefRR8TMnDiU';
