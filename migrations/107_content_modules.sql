ALTER TABLE books ADD COLUMN content_blocks TEXT;
ALTER TABLE places ADD COLUMN content_blocks TEXT;
ALTER TABLE releases ADD COLUMN content_blocks TEXT;
ALTER TABLE chapters ADD COLUMN content_blocks TEXT;
ALTER TABLE series ADD COLUMN content_blocks TEXT;
CREATE TABLE pages (
 id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
 language TEXT NOT NULL DEFAULT 'de' CHECK(language IN ('de','en','fr')),
 menu_label TEXT, sort_order INTEGER NOT NULL DEFAULT 10, show_in_navigation INTEGER NOT NULL DEFAULT 0,
 is_published INTEGER NOT NULL DEFAULT 0, parent_id INTEGER REFERENCES pages(id) ON DELETE RESTRICT,
 description TEXT, content_blocks TEXT
);
CREATE TABLE content_urls (path TEXT PRIMARY KEY, area TEXT NOT NULL, item_id INTEGER NOT NULL);
