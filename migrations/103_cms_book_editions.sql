ALTER TABLE books ADD COLUMN language TEXT NOT NULL DEFAULT 'de' CHECK (language IN ('de','en','fr'));
ALTER TABLE books ADD COLUMN menu_label TEXT;
ALTER TABLE books ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 10 CHECK (sort_order >= 0);
ALTER TABLE books ADD COLUMN show_in_navigation INTEGER NOT NULL DEFAULT 1 CHECK (show_in_navigation IN (0,1));
ALTER TABLE books ADD COLUMN is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0,1));
ALTER TABLE books ADD COLUMN soundtrack_source TEXT NOT NULL DEFAULT 'series' CHECK (soundtrack_source IN ('series','english_book'));
ALTER TABLE books ADD COLUMN soundtrack_series_id INTEGER REFERENCES series(id) ON DELETE SET NULL;
ALTER TABLE books ADD COLUMN audiobook_series_id INTEGER REFERENCES series(id) ON DELETE SET NULL;

UPDATE books SET menu_label = upper(title);
UPDATE books SET soundtrack_series_id=(SELECT id FROM series WHERE slug='the-greece-chapters'),
  audiobook_series_id=(SELECT id FROM series WHERE slug='hoerbuch-die-orte-die-uns-sahen')
WHERE slug IN ('die-orte-die-uns-sahen','die-orte-die-mich-sahen');
UPDATE books SET language='en',sort_order=20,soundtrack_source='english_book'
WHERE slug='the-places-that-saw-us';
UPDATE books SET language='fr',sort_order=30,
  soundtrack_series_id=(SELECT id FROM series WHERE slug='the-greece-chapters'),
  audiobook_series_id=(SELECT id FROM series WHERE slug='livre-audio-les-lieux-qui-nous-ont-vus')
WHERE slug='les-lieux-qui-nous-ont-vus';

INSERT OR IGNORE INTO books (slug,title,author,formats,language,menu_label,sort_order,soundtrack_source)
VALUES ('the-places-that-saw-us','The Places That Saw Us','Werner Freiberger',NULL,'en','THE PLACES THAT SAW US',20,'english_book');
INSERT OR IGNORE INTO books (slug,title,author,formats,language,menu_label,sort_order,soundtrack_series_id,audiobook_series_id)
VALUES ('les-lieux-qui-nous-ont-vus','Les lieux qui nous ont vus','Werner Freiberger',NULL,'fr','LES LIEUX QUI NOUS ONT VUS',30,
  (SELECT id FROM series WHERE slug='the-greece-chapters'),(SELECT id FROM series WHERE slug='livre-audio-les-lieux-qui-nous-ont-vus'));
